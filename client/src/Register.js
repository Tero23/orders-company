import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const NAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const PHONE_REGEX =
  /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
const ROLE_REGEX = /(Administrator|User|Salesman|Designer)/g;
const LOCATION_REGEX = /(A|B|C)/g;

const REGISTER_URL = "http://localhost:8000/api/v1/users/signup";

const Register = () => {
  let navigate = useNavigate();
  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [fName, setFName] = useState("");
  const [validFName, setValidFName] = useState(false);
  const [fNameFocus, setFNameFocus] = useState(false);

  const [lName, setLName] = useState("");
  const [validLName, setValidLName] = useState(false);
  const [lNameFocus, setLNameFocus] = useState(false);

  const [phone, setPhone] = useState("");
  const [validPhone, setValidPhone] = useState(false);
  const [phoneFocus, setPhoneFocus] = useState(false);

  const [location, setLocation] = useState("");
  const [validLocation, setValidLocation] = useState(false);
  const [locationFocus, setLocationFocus] = useState(false);

  const [role, setRole] = useState("");
  const [validRole, setValidRole] = useState(false);
  const [roleFocus, setRoleFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
    setValidFName(NAME_REGEX.test(fName));
    setValidLName(NAME_REGEX.test(lName));
    setValidPhone(PHONE_REGEX.test(phone));
    setValidRole(ROLE_REGEX.test(role));
    setValidLocation(LOCATION_REGEX.test(location));
  }, [email, fName, lName, phone, role, location]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [email, pwd, matchPwd, fName, lName, phone, role, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = EMAIL_REGEX.test(email);
    const v2 = PWD_REGEX.test(pwd);
    const v3 = NAME_REGEX.test(fName);
    const v4 = NAME_REGEX.test(lName);
    const v5 = PHONE_REGEX.test(phone);
    const v6 = ROLE_REGEX.test(role);
    const v7 = LOCATION_REGEX.test(location);

    if (!(v1 && v2 && v3 && v4 && v5 && v6 && v7)) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post(
        REGISTER_URL,
        { email, password: pwd },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response?.data.status === "success") {
        setSuccess(true);
        setEmail("");
        setPwd("");
        setMatchPwd("");
        setFName("");
        setLName("");
        setLocation("");
        setRole("");
        setPhone("");
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setErrMsg("Email Taken");
      } else {
        setErrMsg("Registration Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        navigate("/order")
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">
              Email:
              <FontAwesomeIcon
                icon={faCheck}
                className={validEmail ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validEmail || !email ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="email"
              ref={emailRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              aria-invalid={validEmail ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
            />
            <p
              id="uidnote"
              className={
                emailFocus && email && !validEmail
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />A Valid email address!
            </p>

            <label htmlFor="fName">
              FirstName:
              <FontAwesomeIcon
                icon={faCheck}
                className={validFName ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validFName || !fName ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="fName"
              autoComplete="off"
              onChange={(e) => setFName(e.target.value)}
              value={fName}
              required
              aria-invalid={validFName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setFNameFocus(true)}
              onBlur={() => setFNameFocus(false)}
            />
            <p
              id="uidnote"
              className={
                fNameFocus && fName && !validFName
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>

            <label htmlFor="lName">
              LastName:
              <FontAwesomeIcon
                icon={faCheck}
                className={validLName ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validLName || !lName ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="lName"
              autoComplete="off"
              onChange={(e) => setLName(e.target.value)}
              value={lName}
              required
              aria-invalid={validLName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setLNameFocus(true)}
              onBlur={() => setLNameFocus(false)}
            />
            <p
              id="uidnote"
              className={
                lNameFocus && lName && !validLName
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>

            <label htmlFor="phone">
              Phone:
              <FontAwesomeIcon
                icon={faCheck}
                className={validPhone ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validPhone || !phone ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="phone"
              autoComplete="off"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              required
              aria-invalid={validPhone ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setPhoneFocus(true)}
              onBlur={() => setPhoneFocus(false)}
            />
            <p
              id="uidnote"
              className={
                phoneFocus && phone && !validPhone
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />A Valid US phone number!
            </p>

            <label htmlFor="location">
              Location:
              <FontAwesomeIcon
                icon={faCheck}
                className={validLocation ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validLocation || !location ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="location"
              autoComplete="off"
              onChange={(e) => setLocation(e.target.value)}
              value={location}
              required
              aria-invalid={validLocation ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setLocationFocus(true)}
              onBlur={() => setLocationFocus(false)}
            />
            <p
              id="uidnote"
              className={
                locationFocus && location && !validLocation
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />A Valid US location!
            </p>

            <label htmlFor="role">
              Role:
              <FontAwesomeIcon
                icon={faCheck}
                className={validRole ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validRole || !role ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="role"
              autoComplete="off"
              onChange={(e) => setRole(e.target.value)}
              value={role}
              required
              aria-invalid={validRole ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setRoleFocus(true)}
              onBlur={() => setRoleFocus(false)}
            />
            <p
              id="uidnote"
              className={
                roleFocus && role && !validRole ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Role must be either User or Administrator or Designer or Salesman!
            </p>

            <label htmlFor="password">
              Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validPwd ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validPwd || !pwd ? "hide" : "invalid"}
              />
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            <p
              id="pwdnote"
              className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 characters.
              <br />
              Must include uppercase and lowercase letters, a number and a
              special character.
              <br />
              Allowed special characters:{" "}
              <span aria-label="exclamation mark">!</span>{" "}
              <span aria-label="at symbol">@</span>{" "}
              <span aria-label="hashtag">#</span>{" "}
              <span aria-label="dollar sign">$</span>{" "}
              <span aria-label="percent">%</span>
            </p>

            <label htmlFor="confirm_pwd">
              Confirm Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validMatch && matchPwd ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validMatch || !matchPwd ? "hide" : "invalid"}
              />
            </label>
            <input
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)}
              value={matchPwd}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <p
              id="confirmnote"
              className={
                matchFocus && !validMatch ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match the first password input field.
            </p>

            <button
              disabled={
                !validEmail ||
                !validPwd ||
                !validMatch ||
                !validFName ||
                !validLName ||
                !validLocation ||
                !validRole ||
                !validPhone
                  ? true
                  : false
              }
            >
              Sign Up
            </button>
          </form>
          <p>
            Already registered?
            <br />
            <span className="line">
              <Link to="/login">Login</Link>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Register;
