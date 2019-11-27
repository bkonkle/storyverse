-- Query: getCurrentUser
---------------------------

DROP FUNCTION IF EXISTS get_current_user;

CREATE FUNCTION get_current_user() RETURNS users AS $$
  SELECT * FROM users WHERE users.username = current_setting('jwt.claims.sub');
$$ LANGUAGE sql STABLE;

COMMENT ON FUNCTION get_current_user IS E'Get a user based on the logged-in JWT claims.';
GRANT EXECUTE ON FUNCTION get_current_user TO storyverse_user;
