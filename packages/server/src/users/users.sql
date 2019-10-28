-- Mutation: getCurrentUser
---------------------------

DROP FUNCTION IF EXISTS get_current_user;

CREATE FUNCTION get_current_user() RETURNS users AS $$
  INSERT INTO users (username) VALUES (current_setting('jwt.claims.sub'))
    ON CONFLICT (username) DO UPDATE SET username = current_setting('jwt.claims.sub')
    RETURNING *;
$$ LANGUAGE sql VOLATILE;

COMMENT ON FUNCTION get_current_user IS E'Get or create a user based on the logged-in JWT claims.';
GRANT EXECUTE ON FUNCTION get_current_user TO storyverse_user;
