target(4,4,20).
target(4,6,20).
target(6,4,20).
target(6,6,20).

#heuristic puzzle(R,C,V) : target(R,C,Level), value(V). [Level,false]

around(R,C,R+1,C) :- row(R), col(C), row(R+1).
around(R,C,R,C+1) :- row(R), col(C), col(C+1).
around(R,C,R+1,C+1) :- row(R), col(C), row(R+1), col(C+1).
puzzle(R,C) :- puzzle(R,C,V).
#heuristic puzzle(R,C,V) :
    around(R,C,R2,C2), puzzle(R2,C2), value(V). [10,false]
