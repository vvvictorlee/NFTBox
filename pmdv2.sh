#!/bin/bash
sum=10000
for ((i=1; i<=140000; i+=sum))
do
    yarn mdfv2:test $i  $sum &
    sleep 3
done

