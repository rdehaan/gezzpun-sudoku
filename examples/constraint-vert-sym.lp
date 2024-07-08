% The puzzle is vertically (mirror) symmetric
puzzle(R,C) :- puzzle(R,C,V).
:- puzzle(R,C), not puzzle(k*k+1-R,C).
