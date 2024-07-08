% No adjacent cells may have the same value
adjacent(R1,C1,R1,C1+1) :- row(R1), col(C1), col(C1+1).
adjacent(R1,C1,R1+1,C1) :- row(R1), col(C1), row(R1+1).
:- adjacent(R1,C1,R2,C2),
    solution(R1,C1,V), solution(R2,C2,V), value(V).
