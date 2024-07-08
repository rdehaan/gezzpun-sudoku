% Each value appears exactly once in each row
1 { solution(R,C,V) : col(C) } 1 :- row(R), value(V).
