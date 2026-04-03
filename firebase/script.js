import { auth } from "./firebase-config.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

let confirmationResult = null;

window.googleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    alert("Signed in with Google!");
    closeModal();
  } catch (err) {
    alert(err.message);
  }
};

window.sendOTP = () => {
  const phone = document.getElementById("phoneNumber").value;

  window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sendOTP', {
    size: 'invisible',
    callback: () => sendOTP()
  });

  signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
    .then((result) => {
      confirmationResult = result;
      alert("OTP sent!");
    })
    .catch((err) => alert(err.message));
};

window.verifyOTP = () => {
  const code = document.getElementById("otpCode").value;
  if (confirmationResult) {
    confirmationResult.confirm(code)
      .then(() => {
        alert("Phone login successful!");
        closeModal();
      })
      .catch(err => alert("Invalid OTP"));
  }
};

window.closeModal = () => {
  document.getElementById("loginModal").style.display = "none";
};
