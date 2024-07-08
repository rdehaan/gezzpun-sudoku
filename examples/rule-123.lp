% No sequence of 1,2,3 may appear in a row (horizontally or vertically)
row(R,C,R+1,C,R+2,C) :- row(R), row(R+2), col(C).
row(R,C,R,C+1,R,C+2) :- row(R), col(C), col(C+2).
row(R1,C1,R2,C2,R3,C3) :- row(R3,C3,R2,C2,R1,C1).
:- row(R1,C1,R2,C2,R3,C3),
    solution(R1,C1,1), solution(R2,C2,2), solution(R3,C3,3).
