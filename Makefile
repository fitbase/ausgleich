# This file is a part of the pflege-ausgleich.de project
# Copyright 2020 Alex Woroschilow (alex@fitbase.de)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied
PWD:= $(shell pwd)

all: clean
	rm -rf $(PWD)/noarch/*
	rm -rf $(PWD)/build/*

	gulp build

	rpmbuild -bb $(PWD)/release.spec --build-in-place --buildroot=$(PWD)/build --define "_rpmdir $(PWD)"


init:
	npm install
	npm audit fix


clean:
	gulp clean