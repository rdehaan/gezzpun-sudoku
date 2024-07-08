% The puzzle is horizontally (mirror) symmetric
puzzle(R,C) :- puzzle(R,C,V).
:- puzzle(R,C), not puzzle(R,k*k+1-C).
