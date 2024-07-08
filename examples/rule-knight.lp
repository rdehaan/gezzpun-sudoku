% Cells that are a knight's move from each other may not have the same value
knight(R1,C1,R2,C2) :- row(R1), col(C1),
    R2 = R1+1, C2 = C1+2, row(R2), col(C2).
knight(R1,C1,R2,C2) :- row(R1), col(C1),
    R2 = R1+2, C2 = C1+1, row(R2), col(C2).
:- knight(R1,C1,R2,C2), solution(R1,C1,V), solution(R2,C2,V).
