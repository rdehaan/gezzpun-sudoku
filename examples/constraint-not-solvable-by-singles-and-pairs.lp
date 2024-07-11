% Some auxiliary predicates
different_cells(R1,C1,R2,C2) :-
    row(R1), col(C1), row(R2), col(C2), R1 != R2.
different_cells(R1,C1,R2,C2) :-
    row(R1), col(C1), row(R2), col(C2), C1 != C2.

% Define rows/cols/blocks as groups
group(row(R)) :- row(R).
group(col(C)) :- col(C).
small_index(1..3).
group(block(I,J)) :- small_index(I), small_index(J).
in_group(R,C,row(R)) :- row(R), col(C).
in_group(R,C,col(C)) :- row(R), col(C).
in_group(R,C,block(I,J)) :- row(R), col(C), group(block(I,J)),
    I = (R-1)/3+1, J = (C-1)/3+1.
share_group(R1,C1,R2,C2) :-
    group(G),
    row(R1), col(C1), in_group(R1,C1,G),
    row(R2), col(C2), in_group(R2,C2,G),
    different_cells(R1,C1,R2,C2).

% Kickstart the derivation process
derivable(solution(R,C,V)) :- puzzle(R,C,V).

% The 'Full house' deduction rule
derivable(solution(R1,C1,V1)) :-
    value(V1), row(R1), col(C1), solution(R1,C1,V1),
    in_group(R1,C1,G), group(G),
    derivable(solution(R2,C2,V2)) :
        in_group(R2,C2,G),
        different_cells(R1,C1,R2,C2),
        solution(R2,C2,V2).

% Erase pencil marks for corresponding derived values in the same group
derivable(strike(R1,C1,V)) :-
    row(R1), col(C1), row(R2), col(C2), different_cells(R1,C1,R2,C2),
    derivable(solution(R2,C2,V)), share_group(R1,C1,R2,C2).

% Erase other pencil marks when the solution for that cell is derived
derivable(strike(R,C,V1)) :-
    row(R), col(C), derivable(solution(R,C,V2)),
    value(V1), value(V2), V1 != V2.

% The 'Naked singles' deduction rule
derivable(solution(R,C,V1)) :-
    value(V1), row(R), col(C),
    derivable(strike(R,C,V2)) : value(V2), V1 != V2.

% The 'Hidden singles' deduction rule
derivable(solution(R1,C1,V)) :-
    row(R1), col(C1), value(V),
    in_group(R1,C1,G), group(G),
    derivable(strike(R2,C2,V)) : in_group(R2,C2,G),
        different_cells(R1,C1,R2,C2).

% The 'Naked pairs' deduction rule
naked_pairs_setting(R1,C1,R2,C2,R3,C3) :-
    group(G),
    in_group(R1,C1,G), in_group(R2,C2,G), in_group(R3,C3,G),
    different_cells(R1,C1,R2,C2), different_cells(R1,C1,R3,C3),
    different_cells(R2,C2,R3,C3).
derivable(naked_pair(R,C,V1,V2)) :-
    row(R), col(C),
    value(V1), value(V2), V1 < V2,
    derivable(strike(R,C,W)) : value(W),
        V1 != W, V2 != W.
derivable(solution(R,C,V1)) :-
    row(R), col(C),
    value(V1), value(V2), V1 < V2,
    derivable(naked_pair(R,C,V1,V2)),
    derivable(strike(R,C,V2)).
derivable(solution(R,C,V2)) :-
    row(R), col(C),
    value(V1), value(V2), V1 < V2,
    derivable(naked_pair(R,C,V1,V2)),
    derivable(strike(R,C,V1)).
derivable(strike(R1,C1,V1)) :-
    value(V1),
    naked_pairs_setting(R1,C1,R2,C2,R3,C3),
    derivable(naked_pair(R2,C2,V1,V2)),
    derivable(naked_pair(R3,C3,V1,V2)).
derivable(strike(R1,C1,V2)) :-
    value(V1),
    naked_pairs_setting(R1,C1,R2,C2,R3,C3),
    derivable(naked_pair(R2,C2,V1,V2)),
    derivable(naked_pair(R3,C3,V1,V2)).

% The 'Hidden pairs' deduction rule
derivable(vvalue_only_in_two_cells_in_group(V,R1,C1,R2,C2,G)) :-
    value(V), group(G),
    row(R1), col(C1), row(R2), col(C2),
    different_cells(R1,C1,R2,C2),
    in_group(R1,C1,G), in_group(R2,C2,G),
    derivable(strike(R,C,V)) : in_group(R,C,G),
        different_cells(R,C,R1,C1), different_cells(R,C,R2,C2).
cell_in_pair(R1,C1,R1,C1,R2,C2) :-
    row(R1), col(C1), row(R2), col(C2).
cell_in_pair(R2,C2,R1,C1,R2,C2) :-
    row(R1), col(C1), row(R2), col(C2).
derivable(strike(R,C,V)) :-
    value(V), group(G),
    row(R1), col(C1), row(R2), col(C2),
    in_group(R1,C1,G), in_group(R2,C2,G),
    cell_in_pair(R,C,R1,C1,R2,C2),
    different_cells(R1,C1,R2,C2),
    value(V1), value(V2), V1 < V2,
    V1 != V, V2 != V,
    derivable(value_only_in_two_cells_in_group(V1,R1,C1,R2,C2,G)),
    derivable(value_only_in_two_cells_in_group(V2,R1,C1,R2,C2,G)).

% Require that not the full solution is derived
:- derivable(solution(R,C,V)) : solution(R,C,V).
