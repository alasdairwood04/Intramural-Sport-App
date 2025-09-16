
-- @block
SELECT * FROM users;

-- @block
SELECT * FROM teams;

-- @block
SELECT * FROM sports;

-- @block
SELECT * FROM seasons;


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
