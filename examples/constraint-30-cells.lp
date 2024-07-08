% At most 30 cells are filled in in the puzzle
:- not #count { 1,R,C,V : puzzle(R,C,V) } <= 30.
