DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS ballot_options;

CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    title TEXT NOT NULL,
    content TEXT NOT NULL
);


CREATE TABLE ballot_options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created DATE NOT NULL DEFAULT (DATE('now')),
    content TEXT NOT NULL,
    voteCount INTEGER DEFAULT 0
);



-- when a user writes in a ballot, it becomes a new voting option

-- what should the congressman do

-- someone says enact a new law about universal healthcare 

-- that becomes a new voting option for that day 

-- if someone votes twice on the same machine, for now just let them do it 





-- eventually overwrite their previous vote based on IP or something - untracked but guessing their network signature 