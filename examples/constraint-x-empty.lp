% The diagonals are not filled in yet in the puzzle
:- row(R), puzzle(R,R,V), value(V).
:- row(R), puzzle(R,k*k+1-R,V), value(V).
