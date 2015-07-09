---
layout: post
title:  Simple Object Classifier Using Bag of Words
date:   2015-2-20 16:09:58
categories: Pattern Recongnition
tags: BOW SVM SURF
---
I want to build a object classifier ,for my final project in [Computer Vison](http://www.cs.zju.edu.cn/~gpan/course/cv2014g "Computer Vison") Course.As the document says ,this project has following requirements.

1. build a database that contains at least 10  kinds of objects ,such as horse,face,cars.
2. show user the category of input object which is unknown.
3. implement more than two methods if possible.
4.    make performance test on your own data sets (Classification accuracy)

Many methods are available.Among these methods , feature learning ＋ similar matching / classification is the most famous.For feature learning.I follow a very simple technique named Bag of words.
The method is simple:

1. **```Extract features```** of choice from training set that contains all classes.
2. **```Create a vocabulary```** of features by clustering the features (kNN, etc). Let's say 500 features long.
3. **```Train your classifiers```** (SVMs, Naive-Bayes, boosting, etc) on training set again (preferably a different one), this time check the features in the image for their closest clusters in the vocabulary. Create a histogram of responses for each image to words in the vocabulary, it will be a 1000-entries long vector. Create a sample-label dataset for the training.
4. When you get an image you havn't seen - run the classifier and it should, god willing, give you the right class.

## Extract Features ##
Starting with the following step:

1. Create a FeatureDetector(SURF、SIFT)
2.  Extract  features of an image and put them in a vector(you should resize the image in order to extract features)

    	SurfFeatureDetector detector(400);
		Ptr<DescriptorExtractor > extractor(
			new OpponentColorDescriptorExtractor(
			Ptr<DescriptorExtractor>(new SurfDescriptorExtractor())
			)
			);

		Mat descriptors;
		Mat training_descriptors(1, extractor->descriptorSize(), extractor->descriptorType());
		Mat img;

		while (dirp = readdir(dp))
		{
			//	count++;
			filepath = dir + "/" + dirp->d_name;

			// If the file is a directory (or is in some way invalid) we'll skip it 
			if (stat(filepath.c_str(), &filestat)) continue;
			if (S_ISDIR(filestat.st_mode))         continue;

			img = imread(filepath);
			if (!img.data) {
				continue;
			}

			resize(img, img, Size(imageSize, imageSize), 0, 0, CV_INTER_LINEAR);
			detector.detect(img, keypoints);
			extractor->compute(img, keypoints, descriptors);
			training_descriptors.push_back(descriptors);
			cout << ".";
		}




## Create vocabulary ##

Let's go create a vocabulary then.Opencv has provide a simple API for users. 


    BOWKMeansTrainer bowtrainer(1000); //num clusters
	bowtrainer.add(training_descriptors);
	Mat vocabulary = bowtrainer.cluster();

##  Train  SVM classifiers ##
We're gonna train a 2-class SVM, in a 1-vs-all kind of way. Meaning we train an SVM that can say "yes" or "no" when choosing between one class and the rest of the classes, hence 1-vs-all.
But first, we need to scour the training set for our histograms (the responses to the vocabulary, remember?):

	Ptr<ifstream> ifs(new ifstream("train.txt"));
	int total_samples = 0;
	vector<string> classes_names;
	char buf[1024]; int count = 0;
	vector<string> lines;
	while (!ifs->eof()) {// && count++ < 30) {
		ifs->getline(buf, 1024);
		if (ifs->fail()){
			break;
		}
		lines.push_back(buf);
	}
	for (int i = 0; i < lines.size(); i++) {
		vector<KeyPoint> keypoints;
		Mat response_hist;
		Mat img;
		string filepath;
		string line(lines[i]);
		istringstream iss(line);
		iss >> filepath;
		string class_; iss >> class_;

		if (class_.size() == 0) continue;
		class_ = "class_" + class_;
		img = imread(filepath);
		resize(img, img, Size(imageSize, imageSize), 0, 0, CV_INTER_LINEAR);
		//imshow("", img);
		//waitKey(0);
		detector->detect(img, keypoints);
		bowide.compute(img, keypoints, response_hist);
		cout << "."; cout.flush();
		if (classes_training_data.count(class_) == 0) { //not yet created...
			classes_training_data[class_].create(0, response_hist.cols, response_hist.type());
			classes_names.push_back(class_);
		}
		classes_training_data[class_].push_back(response_hist);
		total_samples++;
		//		waitKey(0);
	}


Now,  notice I'm keeping the training data for each class separately, this is because we will need this for later creating the 1-vs-all samples-labels matrices.Alright, data gotten, let's get training:

	vector<string> classes_names;
	for (map<string, Mat>::iterator it = classes_training_data.begin(); it != classes_training_data.end(); ++it) {
		classes_names.push_back((*it).first);
	}
	for (int i = 0; i < classes_names.size(); i++) {
		string class_ = classes_names[i];
		Mat samples(0, response_cols, response_type);
		Mat labels(0, 1, CV_32FC1);

		//copy class samples and label
		samples.push_back(classes_training_data[class_]);
		Mat class_label = Mat::ones(classes_training_data[class_].rows, 1, CV_32FC1);
		labels.push_back(class_label);

		//copy rest samples and label
		for (map<string, Mat>::iterator it1 = classes_training_data.begin(); it1 != classes_training_data.end(); ++it1) {
			string not_class_ = (*it1).first;
			if (not_class_.compare(class_) == 0) continue;
			samples.push_back(classes_training_data[not_class_]);
			class_label = Mat::zeros(classes_training_data[not_class_].rows, 1, CV_32FC1);
			labels.push_back(class_label);
		}

		Mat samples_32f; samples.convertTo(samples_32f, CV_32F);
		if (samples.rows == 0) continue;
		CvSVM classifier;
		//CvParamGrid Cgrid(0.1, 10000, sqrt(10.0f));
		classifier.train(samples_32f, labels);

		{
			stringstream ss;
			ss << featureDescriptor << "_SVM_classifier_";

			ss << class_ << ".yml";
			classifier.save(ss.str().c_str());
		}
	} 


Note how I build the samples and the labels, where each time I put in the positive samples and mark the labels '1', and then I put the rest of the samples and label them '0'.
Moving on to .... testing the classifiers!




	resize(__img, __img, Size(imageSize, imageSize), 0, 0, CV_INTER_LINEAR);
	Mat response_hist;
	vector<KeyPoint> keypoints;
	detector->detect(__img, keypoints);
	bowide->compute(__img, keypoints, response_hist);
	out_classes.clear();
	float minf = FLT_MAX; string minclass;

	for (map<string, unique_ptr<CvSVM>>::iterator it = classes_classifiers.begin(); it != classes_classifiers.end(); ++it) {
		//std::cout << (*it).first << std::endl;
		float res = (*it).second->predict(response_hist, true);
		//std::cout << res<< std::endl;
		string str1 = (*it).first;
		double temp1 = atof(str1.c_str());
		int temp2 = int(temp1);
		out_classes.insert(pair<float, string>(res, getObjectType(temp2)));
		if (res > 1.0) continue;
		if (res < minf) {
			minf = res;
			minclass = (*it).first;
		}
	}
	double obj = atof(minclass.c_str());


## Code ##
Get the whole thing at:
[https://github.com/bearshng/code/tree/master/objectRecongnition](https://github.com/bearshng/code/tree/master/object%20Recongnition)