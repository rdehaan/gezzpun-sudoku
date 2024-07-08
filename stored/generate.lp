#const k=3.
index(1..k*k).
row(R) :- index(R).
col(C) :- index(C).
value(V) :- index(V).

#show puzzle/3.
#show solution/3.

% There is exactly one value in each cell
1 { solution(R,C,V) : value(V) } 1 :- row(R), col(C).

{ puzzle(R,C,V) : row(R), col(C), value(V) }.

solution(R,C,V) :- puzzle(R,C,V).
