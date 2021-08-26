#!/bin/bash
sum=20000
for ((i=1; i<=140000; i+=sum))
do
    yarn mds:test $i  700 &
    sleep 3
done

