% No adjacent cells may have subsequent values
adjacent(R1,C1,R1,C1+1) :- row(R1), col(C1), col(C1+1).
adjacent(R1,C1,R1+1,C1) :- row(R1), col(C1), row(R1+1).
:- adjacent(R1,C1,R2,C2),
    solution(R1,C1,V1), solution(R2,C2,V2),
    value(V1), value(V2), |V1-V2|=1.
