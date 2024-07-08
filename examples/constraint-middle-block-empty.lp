% The middle block is not filled in yet in the puzzle
middle(4..6).
:- middle(R), middle(C), puzzle(R,C,V), value(V).
