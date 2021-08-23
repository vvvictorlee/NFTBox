#!/bin/bash

sum=0

for ((i=1; i<=100; i+=10))
do
    yarn mds:test $i
done

