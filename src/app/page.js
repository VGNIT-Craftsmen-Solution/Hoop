"use client";
import React, { useEffect, useState, useRef } from "react";

// Companions are now loaded dynamically from the API

const W = ['to a wedding.', 'for coffee.', 'to a gig.', 'to the movies.', 'to a cricket match.'];
const M = ['Weddings', 'Coffee dates', 'Gigs', 'Movie nights', 'Cricket', 'Treks', 'Sangeet', 'Dinners'];

function AvatarGraphic({ sk, hr, bg, sh, long }) {
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: bg }}></div>
      <svg
        viewBox="0 0 200 260"
        preserveAspectRatio="xMidYMax slice"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        {long ? (
          <path d="M58 100Q52 40 100 40Q148 40 142 100L148 200H52Z" fill={hr} />
        ) : null}
        <path d="M14 262Q24 188 100 178Q176 188 186 262Z" fill={sh} />
        <rect x="88" y="140" width="24" height="44" rx="10" fill={sk} />
        <ellipse cx="100" cy="106" rx="36" ry="43" fill={sk} />
        <path
          d="M62 102Q58 52 100 52Q142 52 138 102Q126 78 100 78Q74 78 62 102Z"
          fill={hr}
        />
        <circle cx="87" cy="108" r="3" fill="#8E0F4B" />
        <circle cx="113" cy="108" r="3" fill="#8E0F4B" />
        <path
          d="M88 126Q100 136 112 126"
          stroke="#C2185B"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </>
  );
}

export default function Home() {
  const [companions, setCompanions] = useState([]);
  const [curStack, setCurStack] = useState(0);

  useEffect(() => {
    fetch('/api/companions')
      .then(res => res.json())
      .then(data => {
        if (data.companions) setCompanions(data.companions);
      })
      .catch(console.error);
  }, []);
  const [rotText, setRotText] = useState(W[0]);
  const [rotAnim, setRotAnim] = useState(true);
  
  const [stackTransform, setStackTransform] = useState("");
  const swRef = useRef(null);

  const [selDay, setSelDay] = useState("Fri 3");
  const [selTime, setSelTime] = useState("5:00 pm");
  const [reqStatus, setReqStatus] = useState("idle"); // idle, sent, accepted, declined
  const [rating, setRating] = useState(0);
  const [authModalStep, setAuthModalStep] = useState(0); // 0 = closed
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // Stack rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurStack((prev) => (prev + 1) % 4);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // Text rotation
  useEffect(() => {
    let wi = 0;
    const interval = setInterval(() => {
      wi = (wi + 1) % W.length;
      setRotAnim(false);
      setTimeout(() => {
        setRotText(W[wi]);
        setRotAnim(true);
      }, 50);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    if (!swRef.current) return;
    const r = swRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setStackTransform(`rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`);
  };

  const handleMouseLeave = () => {
    setStackTransform("");
  };

  const handleOtpChange = (idx, val) => {
    const newVal = val.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[idx] = newVal;
    setOtp(newOtp);
    if (newVal && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    }
  };

  return (
    <>
      <nav>
        <span className="logo">hoop</span>
        <div className="pill gl">
          <a href="#hero">Browse</a>
          <a href="#how">How it works</a>
          <a href="#trust">Safety</a>
        </div>
        <button className="btn" onClick={() => setAuthModalStep(1)}>
          Log in
        </button>
      </nav>

      <header className="hero" id="hero">
        <div>
          <h1>
            Someone to go
            <br />
            <span
              className="rot"
              id="rot"
              style={{ animation: rotAnim ? "swap .55s cubic-bezier(.2,.9,.2,1) both" : "none" }}
            >
              {rotText}
            </span>
          </h1>
          <p>Book a verified companion for weddings, coffee, gigs and every plan you'd rather not do alone.</p>
          <div className="cta">
            <button className="btn" onClick={() => setAuthModalStep(1)}>
              Get started
            </button>
            <span className="tag gl">✓ Every companion ID-verified</span>
          </div>
        </div>
        <div
          className="stackw"
          id="sw"
          ref={swRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="fl gl" style={{ left: 0, top: "14%", rotate: "-8deg" }}>
            💍 Sangeet
          </div>
          <div className="fl gl" style={{ left: "6%", bottom: "12%", rotate: "6deg", animationDelay: "-1.5s" }}>
            ☕ Coffee
          </div>
          <div className="fl gl" style={{ right: 0, bottom: "22%", rotate: "-5deg", animationDelay: "-3s" }}>
            🎶 Gig
          </div>
          <div className="toast gl">
            <i>✓</i>
            <span>
              Riya accepted<br />
              your request
            </span>
          </div>
          <div className="stack" id="stack" style={{ transform: stackTransform }}>
            {companions.map((f, i) => {
              const p = (i - curStack + 4) % 4;
              return (
                <div
                  key={i}
                  className="cd"
                  data-p={p}
                  style={
                    p === 0
                      ? { transform: "rotate(-2deg)", zIndex: 4 }
                      : p === 1
                      ? { transform: "translate(22px,18px) rotate(5deg) scale(.95)", zIndex: 3, filter: "saturate(.8) brightness(1.04)" }
                      : p === 2
                      ? { transform: "translate(-18px,36px) rotate(-7deg) scale(.9)", zIndex: 2, filter: "saturate(.7) brightness(1.08)" }
                      : { transform: "translate(130%,-12%) rotate(24deg)", opacity: 0, zIndex: 5 }
                  }
                >
                  <AvatarGraphic sk={f.sk} hr={f.hr} bg={f.bg} sh={f.sh} long={f.long} />
                  <div className="inf gl">
                    <div>
                      <b>
                        {f.name}, {f.age}
                      </b>
                      <small>
                        ★ {f.rating} · {f.rate}/hr
                      </small>
                    </div>
                    <span className="vf">✓ Verified</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </header>

      <div className="mq" aria-hidden="true">
        <div>
          {[...M, ...M, ...M, ...M].map((m, i) => (
            <span key={i}>{m} ✦</span>
          ))}
        </div>
      </div>

      <section className="sec" id="how">
        <h2>Book it in four taps.</h2>
        <p>Try it right here. This is exactly how Hoop works.</p>
        <div className="bento">
          <div className="bc gl s7">
            <h3>Pick your slot</h3>
            <p>Choose a date and time from the companion's availability.</p>
            <div className="chs" data-g="d">
              {["Fri 3", "Sat 4", "Sun 5"].map((d) => (
                <button
                  key={d}
                  className={`ch ${selDay === d ? "on" : ""}`}
                  onClick={() => setSelDay(d)}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="chs" data-g="t">
              {["5:00 pm", "6:30 pm", "8:00 pm"].map((t) => (
                <button
                  key={t}
                  className={`ch ${selTime === t ? "on" : ""}`}
                  onClick={() => setSelTime(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="sum" id="sum">
              {selDay} · {selTime} with Riya
            </div>
            <button className="btn" onClick={async () => {
              setReqStatus("sent");
              if (companions[0]) {
                await fetch('/api/bookings', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    companionId: companions[0].id,
                    date: selDay,
                    time: selTime
                  })
                });
              }
            }}>
              {reqStatus !== "idle" ? "Request sent ✓" : "Send request"}
            </button>
          </div>
          <div className="bc gl s5">
            <h3>They decide.</h3>
            <p>Contact details stay hidden until they accept.</p>
            <div className="req">
              <div className="av" id="av">
                {companions[0] && (
                  <AvatarGraphic sk={companions[0].sk} hr={companions[0].hr} bg={companions[0].bg} sh={companions[0].sh} long={companions[0].long} />
                )}
              </div>
              <div>
                <b>{companions[0]?.name || "Riya"}, {companions[0]?.age || 25}</b>
                <br />
                <span className="st" id="stt">
                  {reqStatus === "accepted" ? "Accepted ✓" : reqStatus === "declined" ? "Declined" : "Pending"}
                </span>
              </div>
            </div>
            <div className={`cont ${reqStatus === "accepted" ? "on" : ""}`} id="cont">
              +91 98765 43210
            </div>
            <div className="acts">
              <button className="btn" onClick={() => setReqStatus("accepted")}>
                Accept
              </button>
              <button className="btn w" onClick={() => setReqStatus("declined")}>
                Decline
              </button>
            </div>
          </div>
          <div className="bc gl s5">
            <h3>Rate the outing.</h3>
            <p>Only completed bookings can be rated.</p>
            <div className="stars" id="stars">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  className={rating >= n ? "on" : ""}
                  onClick={() => setRating(n)}
                >
                  ★
                </button>
              ))}
            </div>
            <div className="sum" id="rt">
              {rating > 0 ? `You rated ${rating}/5. Thanks!` : "Tap a star"}
            </div>
          </div>
          <div className="bc gl s7" id="trust">
            <h3>Checked before they go live.</h3>
            <p>No verification, no profile.</p>
            <div className="ver">
              <div>
                <svg viewBox="0 0 80 80">
                  <defs>
                    <radialGradient id="a" cx=".3" cy=".25">
                      <stop offset="0" stopColor="#FFC2DC" />
                      <stop offset="1" stopColor="#E0106A" />
                    </radialGradient>
                  </defs>
                  <rect x="22" y="6" width="36" height="68" rx="10" fill="url(#a)" />
                  <circle cx="40" cy="62" r="4" fill="#fff" />
                </svg>
                Phone OTP
              </div>
              <div>
                <svg viewBox="0 0 80 80">
                  <rect x="6" y="18" width="68" height="46" rx="10" fill="url(#a)" />
                  <circle cx="26" cy="40" r="8" fill="#fff" />
                  <rect x="42" y="32" width="24" height="5" rx="2.5" fill="#fff" />
                  <rect x="42" y="44" width="16" height="5" rx="2.5" fill="#fff" />
                </svg>
                Government ID
              </div>
              <div>
                <svg viewBox="0 0 80 80">
                  <path
                    d="M40 6l26 10v20c0 18-11 32-26 38C25 68 14 54 14 36V16z"
                    fill="url(#a)"
                  />
                  <path
                    d="M27 40l10 10 17-20"
                    stroke="#fff"
                    strokeWidth="7"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Selfie match
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="end">
        <div className="rg r1"></div>
        <div className="rg r2"></div>
        <h2>
          Your plus-one
          <br />
          is waiting.
        </h2>
        <button className="btn w" onClick={() => setAuthModalStep(1)}>
          Get started
        </button>
      </section>
      <footer>© 2026 Hoop. Companionship for outings and events only.</footer>

      {authModalStep > 0 && (
        <div
          className="ov on"
          id="ov"
          role="dialog"
          aria-modal="true"
          aria-labelledby="t"
          onClick={(e) => {
            if (e.target.id === "ov") setAuthModalStep(0);
          }}
        >
          <div className="md gl">
            <button className="x" aria-label="Close" onClick={() => setAuthModalStep(0)}>
              ×
            </button>
            {authModalStep === 1 && (
              <div className="sx on">
                <h3 id="t">Sign in to Hoop</h3>
                <p>Enter your phone number. We'll send a 6-digit code.</p>
                <input
                  className="in"
                  type="tel"
                  inputMode="numeric"
                  placeholder="+91 98765 43210"
                  aria-label="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={phone.trim().length > 0 && phone.trim().length < 10 ? { borderColor: '#E5484D' } : {}}
                />
                <button
                  className="btn"
                  onClick={() => {
                    if (phone.trim().length >= 10) setAuthModalStep(2);
                  }}
                >
                  Send code
                </button>
              </div>
            )}
            {authModalStep === 2 && (
              <div className="sx on">
                <h3>Enter the code</h3>
                <p>
                  Sent to <span>{phone}</span>
                </p>
                <div className="otp">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      maxLength={1}
                      inputMode="numeric"
                      aria-label={`Digit ${i + 1}`}
                      value={d}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    />
                  ))}
                </div>
                <button className="btn" onClick={() => setAuthModalStep(3)}>
                  Verify
                </button>
              </div>
            )}
            {authModalStep === 3 && (
              <div className="sx on">
                <h3>How will you use Hoop?</h3>
                <p>You can add the other profile later.</p>
                <button className="role" onClick={() => setAuthModalStep(4)}>
                  <b>I want to book</b>
                  <span>Find a companion for an outing</span>
                </button>
                <button className="role" onClick={() => setAuthModalStep(4)}>
                  <b>I want to be booked</b>
                  <span>Get requests from verified users</span>
                </button>
              </div>
            )}
            {authModalStep === 4 && (
              <div className="sx on">
                <h3>Next: your profile</h3>
                <p>Name, date of birth, preferences, distance, intent and contact. This form comes in the next build.</p>
                <button className="btn" onClick={() => setAuthModalStep(0)}>
                  Close preview
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
