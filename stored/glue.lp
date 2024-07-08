bot :- true(normal(B)) : output(solution(R,C,V),B), solution(R,C,V).
:- not bot.

bot :- puzzle(R,C,V), output(puzzle(R,C,V),B), fail(normal(B)).
bot :- not puzzle(R,C,V), output(puzzle(R,C,V),B), true(normal(B)).
