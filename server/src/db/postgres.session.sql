
-- @block
SELECT * FROM users;

-- @block
SELECT * FROM teams;

-- @block
SELECT * FROM sports;

-- @block
SELECT * FROM seasons;


-- @block
SELECT * FROM fixtures;

-- @block
SELECT * FROM join_requests;

-- @block
-- update test.user@example.com to role captain
UPDATE users SET role = 'captain' WHERE email = 'test.user@example.com';

-- @block
-- update test.user.LawRugby@example.com to role captain
UPDATE users SET role = 'captain' WHERE email = 'test.user.LawRugby@example.com';


-- @block
-- update AdminUser@example.com to role admin
UPDATE users SET role = 'admin' WHERE email = 'AdminUser@example.com';


-- @block
-- inserting a sport
INSERT INTO sports (name, description, max_team_size, min_team_size)
VALUES ('Rugby', 'Intramural Rugby', 100, 15);


-- @block
-- inserting a season
INSERT INTO seasons (name, start_date, end_date)
VALUES ('Intramural Rugby Sem 1 2025', '2025-09-17', '2025-12-15');

-- @block
-- number of members of a team
SELECT u.id, u.first_name, u.last_name, u.email, tm.role
FROM users u
JOIN team_members tm ON u.id = tm.user_id
WHERE tm.team_id = "06919410-059b-4321-9c33-9cafd18f6189";


-- @block
-- make 30df96ac-563a-4485-a723-e736f97e2417 is_active false
UPDATE seasons SET is_active = false WHERE id = '30df96ac-563a-4485-a723-e736f97e2417';


-- @block
-- create 5 different hockey captains
INSERT INTO users (email, password_hash, first_name, last_name, student_id, role)
VALUES
    ('hockey.captain1@example.com', 'password123', 'Hockey', 'Captain1', 'student1', 'captain'),
    ('hockey.captain2@example.com', 'password123', 'Hockey', 'Captain2', 'student2', 'captain'),
    ('hockey.captain3@example.com', 'password123', 'Hockey', 'Captain3', 'student3', 'captain'),
    ('hockey.captain4@example.com', 'password123', 'Hockey', 'Captain4', 'student4', 'captain'),
    ('hockey.captain5@example.com', 'password123', 'Hockey', 'Captain5', 'student5', 'captain');


-- @block
-- create 5 teams for hockey (sport id = 83c6ca07-4173-401a-9897-67c882111cf9)
INSERT INTO teams (name, sport_id, season_id, captain_id)
VALUES
    ('Hockey Team 1', '83c6ca07-4173-401a-9897-67c882111cf9', '30df96ac-563a-4485-a723-e736f97e2417', '87043184-d387-45d5-a672-5e68b55e2f50'),
    ('Hockey Team 2', '83c6ca07-4173-401a-9897-67c882111cf9', '30df96ac-563a-4485-a723-e736f97e2417', '19a01b7f-d0a8-4506-b7f5-9ba98ef3aea2'),
    ('Hockey Team 3', '83c6ca07-4173-401a-9897-67c882111cf9', '30df96ac-563a-4485-a723-e736f97e2417', 'ff1e117e-5382-4723-afeb-0806570a7926'),
    ('Hockey Team 4', '83c6ca07-4173-401a-9897-67c882111cf9', '30df96ac-563a-4485-a723-e736f97e2417', 'fdc70e58-84fe-4a90-9c69-ff3ba9c64eaf'),
    ('Hockey Team 5', '83c6ca07-4173-401a-9897-67c882111cf9', '30df96ac-563a-4485-a723-e736f97e2417', '26fdb70c-5c1e-4a4a-81fa-f6bc00629006');
