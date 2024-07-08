% At most 4 cells in each block are filled in already
small_index(1..3).
block(I-1,J-1) :- small_index(I), small_index(J).
block_cell(I,J,R,C) :- block(I,J), small_index(I1), small_index(J1),
  R = (I*3)+I1, C = (J*3)+J1.
:- block(I,J),
    #count { puzzle(R,C,V) : block_cell(I,J,R,C),
        puzzle(R,C,V), value(V) } > 4.
