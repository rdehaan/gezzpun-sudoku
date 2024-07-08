% No values may appear twice on any of the two diagonals
diagonal(I1,I1,I2,I2) :- index(I1), index(I2), I1 != I2.
diagonal(I1,k*k+1-I1,I2,k*k+1-I2) :- index(I1), index(I2), I1 != I2.
:- diagonal(R1,C1,R2,C2), solution(R1,C1,V), solution(R2,C2,V), value(V).
