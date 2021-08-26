#!/bin/bash
sum=2000
for ((i=103151; i<=123000; i+=sum))
do
    yarn mdfv2:test $i  $sum &
    sleep 3
done

