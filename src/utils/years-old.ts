export function getYearsOld(date: Date) {
  const birth = toObject(date)
  const now = toObject(new Date())

  const yearsOld = now.year - birth.year
  const birthdayPassed =
    now.month > birth.month || (now.month === birth.month && now.day >= birth.day)

  return birthdayPassed ? yearsOld : yearsOld - 1
}

function toObject(date: Date) {
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()
  return { year, month, day }
}
