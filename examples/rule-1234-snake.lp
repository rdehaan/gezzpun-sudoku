% No sequence 1,2,3,4 may appear 'as a snake'
#const snake=4.
adjacent(R1,C1,R1,C1+1) :- row(R1), col(C1), col(C1+1).
adjacent(R1,C1,R1+1,C1) :- row(R1), col(C1), row(R1+1).
snake_values(2..snake).
snake(R,C,1) :- solution(R,C,1).
snake(R1,C1,I) :- snake_value(I), solution(R1,C1,I),
    adjacent(R1,C1,R2,C2), snake(R2,C2,I-1).
:- snake(R,C,snake).
