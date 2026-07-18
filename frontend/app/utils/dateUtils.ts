export const calculateAge = (dateString: string): number => {
  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

export const formatDateTime = (dateString: string): { day: string; hour: string } => {
  const date = new Date(dateString);
  const day = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const hour = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return { day, hour };
};

export const getTimeUntilNextInjection = (lastInjectionDate: string): { hours: number; minutes: number } => {
  const lastInjection = new Date(lastInjectionDate);
  const now = new Date();
  const diffMs = now.getTime() - lastInjection.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return { hours, minutes };
};

export const getNextInjectionTime = (lastInjectionDate: string): string => {
  const lastInjection = new Date(lastInjectionDate);
  const nextInjection = new Date(lastInjection.getTime() + 12 * 60 * 60 * 1000);
  return nextInjection.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};
