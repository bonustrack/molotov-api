CREATE TABLE aliases (
  account VARCHAR(128) NOT NULL,
  alias VARCHAR(128) NOT NULL,
  created INT(11) NOT NULL,
  PRIMARY KEY (account, alias),
  INDEX account (account),
  INDEX alias (alias),
  INDEX created (created)
);

CREATE TABLE discussions (
  id VARCHAR(128) NOT NULL,
  author VARCHAR(128) NOT NULL,
  title VARCHAR(128) NOT NULL,
  body VARCHAR(256) NOT NULL,
  votes INT(11) NOT NULL,
  created INT(11) NOT NULL,
  PRIMARY KEY (id),
  INDEX author (author),
  INDEX votes (votes),
  INDEX created (created)
);

CREATE TABLE proposals (
  id VARCHAR(128) NOT NULL,
  author VARCHAR(128) NOT NULL,
  discussion VARCHAR(128) NOT NULL,
  body VARCHAR(256) NOT NULL,
  scores_1 DECIMAL(64,30) NOT NULL,
  scores_2 DECIMAL(64,30) NOT NULL,
  scores_3 DECIMAL(64,30) NOT NULL,
  scores_total DECIMAL(64,30) NOT NULL,
  votes INT(11) NOT NULL,
  created INT(11) NOT NULL,
  PRIMARY KEY (id),
  INDEX author (author),
  INDEX discussion (discussion),
  INDEX scores_1 (scores_1),
  INDEX scores_2 (scores_2),
  INDEX scores_3 (scores_3),
  INDEX scores_total (scores_3),
  INDEX votes (votes),
  INDEX created (created)
);

CREATE TABLE votes (
  voter VARCHAR(128) NOT NULL,
  discussion VARCHAR(128) NOT NULL,
  proposal VARCHAR(128) NOT NULL,
  choice INT(1) NOT NULL,
  vp DECIMAL(64,30) NOT NULL,
  created INT(11) NOT NULL,
  PRIMARY KEY (voter, discussion, proposal),
  INDEX voter (voter),
  INDEX discussion (discussion),
  INDEX proposal (proposal),
  INDEX choice (choice),
  INDEX vp (vp),
  INDEX created (created)
);
