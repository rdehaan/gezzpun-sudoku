% Each value appears exactly once in each column
1 { solution(R,C,V) : row(R) } 1 :- col(C), value(V).
