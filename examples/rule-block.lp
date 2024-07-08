% Each value appears at most once in each block
block_index(I,B) :- index(I), B = (I-1) / k.
same_block(I1,I2) :-
    index(I1), index(I2), block_index(I1,B), block_index(I2,B).
:- same_block(R1,R2), same_block(C1,C2), (R1,C1) != (R2,C2),
    solution(R1,C1,V), solution(R2,C2,V), value(V).
