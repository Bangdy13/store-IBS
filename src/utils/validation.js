/* eslint-disable no-useless-escape */
const validation = (name, email, password, cf_password) => {
  if (!name || !email || !password) return "Isikan semua kolom dengan benar.";

  if (!validateEmail(email)) return "Email tidak valid.";

  if (password.length < 6) return "Kata sandi harus minimal 6 karakter.";

  if (password !== cf_password) return "Konfirmasi kata sandi tidak cocok.";
};

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return re.test(email);
}

export default validation;
