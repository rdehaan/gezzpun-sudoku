% No two 5's may appear within a rook's move from each other
rook(R,C,R+I,C+I) :- row(R), col(C), index(I), row(R+I), col(C+I).
rook(R,C,R+I,C-I) :- row(R), col(C), index(I), row(R+I), col(C-I).
:- rook(R1,C1,R2,C2), solution(R1,C1,5), solution(R2,C2,5).
