#!/bin/bash
sum=10000
for ((i=97151; i<=140000; i+=sum))
do
    yarn mds:test $i  700 &
    sleep 3
done

