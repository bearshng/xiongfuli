---
layout: post
title:  Opencv exceptions and solutions
date:   2015-3-4 12:53
categories: Opencv
tags: Opencv，CvSVM
---

This blog records exceptions I met when using opencv

CvSVM object is private
------------
while using the line ...

    map<string,CvSVM> classes_classifiers;
    classes_classifiers.insert(pair<string,CvSVM>(class_,CvSVM()));

when i am colpiling it i am getting the error...

    In file included from predict.cpp:10:0: /usr/include/c++/4.7/bits/
        stl_pair.h: In instantiation of ‘std::pair<_T1, >_T2>::pair(const _T1&, const _T2&) [with _T1 = std::basic_string; _T2 = CvSVM]’: predict.cpp:99:64: required from here /usr/local/include/opencv2/ml/ml.hpp:553:5: error: ‘CvSVM::CvSVM(const CvSVM&)’ is private In file included from /usr/include/c++/4.7/utility:72:0, from /usr/include/c++/4.7/algorithm:61, from /usr/local/include/opencv2/core/core.hpp:56, from /usr/local/include/opencv2/highgui/highgui.hpp:46, from predict.cpp:4: /usr/include/c++/4.7/bits/stl_pair.h:105:31: error: within this context

### Answer ###
That error means the copy constructor of the `CvSVM` class is private; therefore you simply can't write valid code that requires a `CvSVM` object to be copied. It follows that you can't copy a class containing a CvSVM object, either, such as a pair. And calling `map::insert` makes a copy.
The first thing you might want to do is check whether there is a newer version of the library that supports C++11. It's quite likely that the `CvSVM` class can be moved even if it can't be copied. If so, this code ought to compile without modification against a newer version.
If not, but you have C++11 support, you can have the object constructed directly in a container, so that it doesn't need to be copied or moved at all. However, this is a bit tricky when the container is a map, since the value you have to construct is actually a pair whose second element is a `CvSVM`. This is how you do it:

    classes_classifiers.emplace(piecewise_construct, make_tuple(class_), make_tuple());

Another possibility, if you have C++11 support, is to store unique_ptr<CvSVM> objects in your map instead of theCvSVM objects themselves. The use of unique_ptr guarantees that when you remove an element from the map, the object is deleted:

    map<string,unique_ptr<CvSVM>> classes_classifiers;
    classes_classifiers.insert(make_pair(class_, unique_ptr<CvSVM>(new CvSVM())));

If you don't have C++11 support, your only option is to store raw pointers to CvSVM in your map. This is less than optimal because it requires you to delete each pointer before erasing it from the map, otherwise you'll leak memory