% For each 2x2 square, the sum may not be more than 25
square_index(1..k*k-1).
square(R,C) :- square_index(R), square_index(C).
square(R,C,R,C) :- square(R,C).
square(R,C,R+1,C) :- square(R,C).
square(R,C,R,C+1) :- square(R,C).
square(R,C,R+1,C+1) :- square(R,C).
:- square(R1,C1),
    #sum { V,R2,C2 : square(R1,C1,R2,C2), solution(R2,C2,V) } > 25.
