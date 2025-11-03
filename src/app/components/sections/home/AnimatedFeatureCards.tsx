'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface AnimatedFeatureCardProps {
  title: React.ReactNode;
  variant: 'lightWeight' | 'asymmetrical' | 'autoClave' | 'impactResist' | 'impactFlex' | 'antiVibration';
}

export function AnimatedFeatureCard({ title, variant }: AnimatedFeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [autoAnimate, setAutoAnimate] = useState(false);

  // Detección de móvil
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Animación continua en móvil
  useEffect(() => {
    if (isMobile) {
      setAutoAnimate(true)
    } else {
      setAutoAnimate(false)
    }
  }, [isMobile])

  const isActive = isMobile ? autoAnimate : isHovered

  return (
    <motion.div 
      className="w-full h-[165px] md:w-[350px] md:h-[350px] border-2 border-[#50a1b0] rounded-[12px] md:rounded-[20px] flex flex-col items-center justify-center gap-4 md:gap-14 cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02, borderColor: '#70c1d0' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="relative w-20 h-20 md:w-48 md:h-48">
        {variant === 'lightWeight' && <LightWeightSvg isHovered={isActive} />}
        {variant === 'asymmetrical' && <AsymmetricalSvg isHovered={isActive} />}
        {variant === 'autoClave' && <AutoClaveSvg isHovered={isActive} />}
        {variant === 'impactResist' && <ImpactResistSvg isHovered={isActive} />}
        {variant === 'impactFlex' && <ImpactFlexSvg isHovered={isActive} />}
        {variant === 'antiVibration' && <AntiVibrationSvg isHovered={isActive} />}
      </div>
      <p className="text-white text-center text-sm md:text-3xl px-2 md:px-4" style={{ fontFamily: 'Poppins' }}>
        {title}
      </p>
    </motion.div>
  );
}

function LightWeightSvg({ isHovered }: { isHovered: boolean }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 174 124" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
      {/* Diamante grande izquierdo */}
      <motion.path
        d="M79.4007 46.1595L56.5794 23L33.7582 46.1595C32.2889 47.6511 32.2889 50.0626 33.7582 51.5542L52.3302 70.3998L45.9518 76.8752L50.2011 81.1891L56.5794 74.7138L62.9578 81.1891L67.2071 76.8752L60.8287 70.3998L79.4007 51.5542C80.8699 50.0626 80.8699 47.6511 79.4007 46.1595ZM56.5707 66.0769L39.5911 48.8479L56.5707 31.619L73.5502 48.8479L56.5707 66.0769Z"
        fill="#F4F8F9"
        animate={{
          y: isHovered ? -30 : 0,
        }}
        transition={{ 
          duration: 0.4, 
          ease: 'easeOut',
          repeat: isHovered ? Infinity : 0,
          repeatType: "reverse"
        }}
      />
      
      {/* Diamante grande derecho blanco */}
      <motion.path
        d="M142.691 26.5234L126.406 10L110.121 26.5234C109.074 27.5863 109.074 29.31 110.121 30.3729L123.371 43.8149L118.822 48.4325L121.858 51.5139L126.406 46.8963L130.954 51.5139L133.99 48.4325L129.441 43.8149L142.691 30.3729C143.737 29.31 143.737 27.5863 142.691 26.5234ZM126.406 40.7335L114.291 28.4437L126.406 16.1538L138.52 28.4437L126.406 40.7335Z"
        fill="#F4F8F9"
        animate={{
          y: isHovered ? -20 : 0,
        }}
        transition={{ 
          duration: 0.8, 
          ease: 'easeOut',
          repeat: isHovered ? Infinity : 0,
          repeatType: "reverse"
        }}
      />
      
      {/* Diamante mediano central (azul) */}
      <motion.path
        d="M107.052 61.227L95.9841 50L84.9165 61.227C84.2039 61.9504 84.2039 63.1205 84.9165 63.8439L93.9166 72.9809L90.8286 76.1159L92.8873 78.2059L95.9753 75.0709L99.0633 78.2059L101.122 76.1159L98.0339 72.9809L107.034 63.8439C107.747 63.1205 107.747 61.9504 107.034 61.227H107.052ZM95.9841 70.882L87.7494 62.531L95.9841 54.18L104.219 62.531L95.9841 70.882Z"
        fill="#50A1B0"
        animate={{
          y: isHovered ? -30 : 0,
        }}
        transition={{ 
          duration: 0.8, 
          ease: 'easeOut',
          repeat: isHovered ? Infinity : 0,
          repeatType: "reverse"
        }}
      />
      
      {/* Diamante pequeño superior izquierdo */}
      <motion.path
        d="M94.973 5.44825L89.6064 0L84.2398 5.44825C83.8966 5.79659 83.8966 6.36821 84.2398 6.71654L88.6122 11.1466L87.1078 12.665L88.1108 13.6832L89.6152 12.1648L91.1196 13.6832L92.1225 12.665L90.6181 11.1466L94.9906 6.71654C95.3337 6.36821 95.3337 5.79659 94.9906 5.44825H94.973ZM89.5976 10.1373L85.6034 6.0824L89.5976 2.02747L93.5917 6.0824L89.5976 10.1373Z"
        fill="#F4F8F9"
        animate={{
          y: isHovered ? -6 : 0,
        }}
        transition={{ 
          duration: 0.8, 
          ease: 'easeOut',
          repeat: isHovered ? Infinity : 0,
          repeatType: "reverse"
        }}
      />
      
      {/* Diamante pequeño superior derecho (azul) */}
      <motion.path
        d="M111.574 19.4483L106.207 14L100.84 19.4483C100.497 19.7966 100.497 20.3682 100.84 20.7165L105.213 25.1466L103.708 26.665L104.711 27.6832L106.216 26.1648L107.72 27.6832L108.723 26.665L107.219 25.1466L111.591 20.7165C111.934 20.3682 111.934 19.7966 111.591 19.4483H111.574ZM106.207 24.1373L102.213 20.0824L106.207 16.0275L110.201 20.0824L106.207 24.1373Z"
        fill="#50A1B0"
        animate={{
          y: isHovered ? -25 : 0,
        }}
        transition={{ 
          duration: 0.8, 
          ease: 'easeOut',
          repeat: isHovered ? Infinity : 0,
          repeatType: "reverse"
        }}
      />
      
      {/* Pluma */}
      <motion.path
        d="M1.19889 12.1914C1.19889 12.1914 3.13172 19.653 8.93795 25.4417C14.7442 31.2303 17.4888 31.785 20.8751 36.0795C24.2614 40.374 26.519 51.5665 26.519 51.5665C26.519 51.5665 25.7149 47.0841 26.0319 43.729C26.3566 40.374 27.6478 34.5853 27.6478 34.5853C27.6478 34.5853 27.9725 42.2349 30.7094 44.6595C33.454 47.0841 41.193 50.2603 46.1952 55.1095C51.1974 59.9586 55.2254 70.9722 55.2254 70.9722C55.2254 70.9722 54.5837 63.8774 53.9343 61.4528C53.2848 59.0282 51.5144 56.0399 51.5144 56.0399C51.5144 56.0399 57.3206 65.1836 68.129 67.7961C78.9374 70.4086 84.5812 66.6777 98.1265 69.4781C111.672 72.2785 120.06 75.8214 120.06 75.8214C120.06 75.8214 117.161 71.7148 113.612 70.5965C110.064 69.4781 106.353 66.8656 106.353 66.8656C106.353 66.8656 120.864 67.7961 132.639 64.6289C144.414 61.4528 157.48 51.7544 157.48 51.7544C157.48 51.7544 140.224 97.4818 86.5141 92.9994C32.8046 88.517 21.6792 56.0489 21.6792 56.0489C21.6792 56.0489 41.9971 98.0454 95.869 96.5513C149.741 95.0572 164.09 48.3993 166.185 41.4923C168.281 34.5853 165.544 12.1914 169.247 12.0035C172.958 11.8156 174.891 19.2862 173.6 28.6178C172.309 37.9494 169.409 50.0813 167.306 54.7516C165.204 59.4218 161.338 65.3894 161.338 65.3894C161.338 65.3894 155.369 88.5349 145.69 98.2423C136.01 107.95 118.916 115.787 118.916 115.787C118.916 115.787 123.431 111.117 126.013 107.019C128.596 102.921 131.016 97.6876 131.016 97.6876C131.016 97.6876 118.761 118.033 97.307 122.515C75.8526 126.997 63.5984 119.903 63.5984 119.903C63.5984 119.903 69.8917 119.903 79.5636 115.608C89.2432 111.314 91.6631 107.583 91.6631 107.583C91.6631 107.583 72.791 119.903 49.0867 111.689C25.3747 103.476 17.311 89.4833 17.311 89.4833C17.311 89.4833 19.4062 91.5321 27.1529 93.0263C34.892 94.5204 37.799 93.5899 37.799 93.5899C37.799 93.5899 8.76786 83.14 3.12399 54.5816C-2.51215 26.0053 1.19889 12.1914 1.19889 12.1914Z"
        fill="#F4F8F9"
        animate={{
          scaleX: isHovered ? 1.1 : 1,
        }}
        transition={{ 
          duration: 0.8, 
          ease: 'easeOut',
          repeat: isHovered ? Infinity : 0,
          repeatType: "reverse"
        }}
      />
    </svg>
  );
}

function AntiVibrationSvg({ isHovered }: { isHovered: boolean }) {
  return (
    <svg 
      width="100%" 
      height="100%" 
      viewBox="0 0 144 95" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      {/* Barra superior */}
      <path 
        d="M137.277 82.6372H5.92468C2.65257 82.6372 0 85.2898 0 88.5619V89.0748C0 92.347 2.65257 94.9995 5.92468 94.9995H137.277C140.549 94.9995 143.201 92.347 143.201 89.0748V88.5619C143.201 85.2898 140.549 82.6372 137.277 82.6372Z" 
        fill="#F4F8F9"
      />
      
      {/* Ondas superiores */}
      <motion.g
        style={{ transformOrigin: 'left center' }}
        animate={{ rotate: isHovered ? 9 : 0 }}
        transition={{ 
          duration: 0.25, 
          ease: 'easeOut',
          repeat: isHovered ? Infinity : 0,
          repeatType: "reverse"
        }}
      >
        <path d="M72.6008 50.7144C100.095 50.7144 127.684 60.8624 138.422 65.2995C140.978 66.3511 142.132 69.3177 140.97 71.8226L140.363 73.1307C139.268 75.4818 136.533 76.5504 134.139 75.5672C124.102 71.4636 97.8555 61.8285 72.6008 61.8285C47.3461 61.8285 19.4069 71.6089 8.95958 75.6869C6.54012 76.6274 3.81289 75.4989 2.76987 73.1221L2.18852 71.8055C1.08565 69.292 2.28256 66.3596 4.83881 65.3508C15.9444 60.9821 44.9522 50.7144 72.5922 50.7144H72.6008Z" fill="#F4F8F9"/>
        <path d="M72.3787 77.3372C62.6068 77.3372 52.8007 73.7294 48.9792 72.1563C48.073 71.7801 47.6626 70.7286 48.073 69.8394L48.2867 69.3778C48.6714 68.5399 49.646 68.1638 50.501 68.5143C54.066 69.9762 63.4019 73.3959 72.3787 73.3959C81.3555 73.3959 91.2898 69.9164 95.0002 68.4715C95.8637 68.1381 96.8298 68.5399 97.1974 69.3863L97.4026 69.8565C97.7958 70.7542 97.3684 71.7972 96.4621 72.1477C92.5124 73.7037 82.2019 77.3457 72.3787 77.3457V77.3372Z" fill="#50A1B0"/>
      </motion.g>

      {/* Ondas inferiores */}
      <motion.g
        style={{ transformOrigin: 'left center' }}
        animate={{ rotate: isHovered ? -9 : 0 }}
        transition={{ 
          duration: 0.25, 
          ease: 'easeOut',
          repeat: isHovered ? Infinity : 0,
          repeatType: "reverse"
        }}
      >
        <path d="M70.6001 44.2855C43.1054 44.2855 15.5168 34.1374 4.7788 29.7003C2.22255 28.6488 1.06839 25.6821 2.2311 23.1772L2.83811 21.8691C3.93242 19.5181 6.6682 18.4494 9.06201 19.4326C19.0989 23.5363 45.3454 33.1713 70.6001 33.1713C95.8548 33.1713 123.794 23.3909 134.241 19.3129C136.661 18.3725 139.388 19.501 140.431 21.8777L141.012 23.1943C142.115 25.7078 140.918 28.6402 138.362 29.649C127.256 34.0177 98.2486 44.2855 70.6086 44.2855H70.6001Z" fill="#F4F8F9"/>
        <path d="M70.8226 17.6628C80.5945 17.6628 90.4006 21.2707 94.2222 22.8437C95.1284 23.2199 95.5387 24.2715 95.1284 25.1606L94.9146 25.6223C94.5299 26.4601 93.5553 26.8363 92.7004 26.4858C89.1353 25.0238 79.7994 21.6041 70.8226 21.6041C61.8459 21.6041 51.9115 25.0837 48.2011 26.5285C47.3376 26.8619 46.3716 26.4601 46.004 25.6137L45.7988 25.1435C45.4055 24.2458 45.833 23.2028 46.7392 22.8523C50.689 21.2963 60.9995 17.6543 70.8226 17.6543V17.6628Z" fill="#50A1B0"/>
      </motion.g>

      {/* Barra inferior */}
      <path 
        d="M137.277 0H5.92468C2.65257 0 0 2.65257 0 5.92468V6.43764C0 9.70975 2.65257 12.3623 5.92468 12.3623H137.277C140.549 12.3623 143.201 9.70975 143.201 6.43764V5.92468C143.201 2.65257 140.549 0 137.277 0Z" 
        fill="#F4F8F9"
      />
    </svg>
  );
}

function AsymmetricalSvg({ isHovered }: { isHovered: boolean }) {
  return (
    <svg 
      width="100%" 
      height="100%" 
      viewBox="0 0 172 187" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      {/* Barra superior derecha */}
      <motion.path
        d="M149.748 78.8499C153.209 78.8499 156.009 76.0493 156.009 72.5893V72.0472C156.009 68.5872 153.209 65.7866 149.748 65.7866H86.8984V78.8499H149.748Z"
        fill="#F4F8F9"
        animate={{ x: isHovered ? 16 : 0 }}
        transition={{ 
          duration: 0.6, 
          ease: 'easeOut',
          repeat: isHovered ? Infinity : 0,
          repeatType: "reverse"
        }}
      />
      
      {/* Barra superior izquierda */}
      <motion.path
        d="M10.9584 65.7773C7.49832 65.7773 4.69775 68.5779 4.69775 72.038V72.58C4.69775 76.04 7.49832 78.8406 10.9584 78.8406H85.0919V65.7773H10.9584Z"
        fill="#F4F8F9"
        animate={{ x: isHovered ? -5 : 0 }}
        transition={{ 
          duration: 0.6, 
          ease: 'easeOut',
          repeat: isHovered ? Infinity : 0,
          repeatType: "reverse"
        }}
      />
      
      {/* Barra media-baja derecha */}
      <motion.path
        d="M145.06 142.431C148.52 142.431 151.32 139.631 151.32 136.171V135.629C151.32 132.169 148.52 129.368 145.06 129.368H86.8984V142.431H145.06Z"
        fill="#F4F8F9"
        animate={{ x: isHovered ? 21 : 0 }}
        transition={{ 
          duration: 0.6, 
          ease: 'easeOut',
          repeat: isHovered ? Infinity : 0,
          repeatType: "reverse"
        }}
      />
      
      {/* Barra media-baja izquierda */}
      <path
        d="M6.26061 129.368C2.80056 129.368 0 132.169 0 135.629V136.171C0 139.631 2.80056 142.431 6.26061 142.431H85.0919V129.368H6.26061Z"
        fill="#F4F8F9"
      />
      
      {/* Barra media izquierda */}
      <motion.path
        d="M24.871 108.174C21.4109 108.174 18.6104 110.975 18.6104 114.435V114.977C18.6104 118.437 21.4109 121.238 24.871 121.238H85.0921V108.174H24.871Z"
        fill="#F4F8F9"
        animate={{ x: isHovered ? -19 : 0 }}
        transition={{ 
          duration: 0.6, 
          ease: 'easeOut',
          repeat: isHovered ? Infinity : 0,
          repeatType: "reverse"
        }}
      />
      
      {/* Barra media derecha */}
      <motion.path
        d="M163.661 121.238C167.121 121.238 169.922 118.437 169.922 114.977V114.435C169.922 110.975 167.121 108.174 163.661 108.174H86.8984V121.238H163.661Z"
        fill="#F4F8F9"
        animate={{ x: isHovered ? 2 : 0 }}
        transition={{ 
          duration: 0.6, 
          ease: 'easeOut',
          repeat: isHovered ? Infinity : 0,
          repeatType: "reverse"
        }}
      />
      
      {/* Barra arriba derecha */}
      <path
        d="M165.73 44.5923H86.8984V57.6555H165.73C169.19 57.6555 171.99 54.855 171.99 51.3949V50.8529C171.99 47.3928 169.19 44.5923 165.73 44.5923Z"
        fill="#F4F8F9"
      />
      
      {/* Barra arriba izquierda */}
      <motion.path
        d="M26.9398 44.5835C23.4798 44.5835 20.6792 47.3841 20.6792 50.8441V51.3862C20.6792 54.8462 23.4798 57.6468 26.9398 57.6468H85.0921V44.5835H26.9398Z"
        fill="#F4F8F9"
        animate={{ x: isHovered ? -21 : 0 }}
        transition={{ 
          duration: 0.6, 
          ease: 'easeOut',
          repeat: isHovered ? Infinity : 0,
          repeatType: "reverse"
        }}
      />
      
      {/* Barra centro-arriba izquierda */}
      <motion.path
        d="M15.6835 86.9805C12.2234 86.9805 9.42285 89.781 9.42285 93.2411V93.7831C9.42285 97.2432 12.2234 100.044 15.6835 100.044H85.0922V86.9805H15.6835Z"
        fill="#F4F8F9"
        animate={{ x: isHovered ? -10 : 0 }}
        transition={{ 
          duration: 0.6, 
          ease: 'easeOut',
          repeat: isHovered ? Infinity : 0,
          repeatType: "reverse"
        }}
      />
      
      {/* Barra centro-arriba derecha */}
      <motion.path
        d="M154.482 100.044C157.942 100.044 160.743 97.2432 160.743 93.7831V93.2411C160.743 89.781 157.942 86.9805 154.482 86.9805H86.8984V100.044H154.482Z"
        fill="#F4F8F9"
        animate={{ x: isHovered ? 11 : 0 }}
        transition={{ 
          duration: 0.6, 
          ease: 'easeOut',
          repeat: isHovered ? Infinity : 0,
          repeatType: "reverse"
        }}
      />
      
      {/* Líneas azules verticales */}
      <path d="M86.4469 29.8306H85.5435V38.973H86.4469V29.8306Z" fill="#50A1B0"/>
      <path d="M86.4469 14.7524H85.5435V23.8949H86.4469V14.7524Z" fill="#50A1B0"/>
      <path d="M86.4469 0H85.5435V9.14248H86.4469V0Z" fill="#50A1B0"/>
      <path d="M86.4469 177.637H85.5435V186.78H86.4469V177.637Z" fill="#50A1B0"/>
      <path d="M86.4469 162.559H85.5435V171.702H86.4469V162.559Z" fill="#50A1B0"/>
      <path d="M86.4469 147.807H85.5435V156.949H86.4469V147.807Z" fill="#50A1B0"/>
    </svg>
  );
}

function AutoClaveSvg({ isHovered }: { isHovered: boolean }) {
  return (
    <svg 
      width="100%" 
      height="100%" 
      viewBox="0 0 167 167" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      {/* Círculo exterior */}
      <path 
        d="M83.5038 167C37.4552 167 0 129.545 0 83.5038C0 37.4626 37.4552 0 83.5038 0C129.552 0 167.008 37.4552 167.008 83.5038C167.008 129.552 129.552 167.008 83.5038 167.008V167ZM83.5038 9.72278C42.8176 9.72278 9.72278 42.8176 9.72278 83.5038C9.72278 124.19 42.8176 157.285 83.5038 157.285C124.19 157.285 157.285 124.19 157.285 83.5038C157.285 42.8176 124.182 9.72278 83.5038 9.72278Z" 
        fill="#F4F8F9"
      />
      
      {/* Arcos azules */}
      <motion.g
        animate={{ rotate: isHovered ? 135 : 0 }}
        style={{ transformOrigin: 'center' }}
        transition={{ 
          duration: 0.6, 
          ease: 'easeOut',
          repeat: isHovered ? Infinity : 0,
          repeatType: "reverse"
        }}
      >
        <path d="M26.9319 75.4263C28.6446 63.2279 34.2314 51.957 43.0941 43.0943L43.1315 43.0569C51.9942 34.2166 63.2427 28.6447 75.4261 26.932V25.4287C62.8463 27.1489 51.2239 32.8779 42.077 42.0023L42.0396 42.0397C32.6608 51.4185 27.1413 63.2055 25.4585 75.4263H26.9394H26.9319Z" fill="#50A1B0"/>
        <path d="M91.5737 25.4214V26.9322C103.795 28.6523 115.073 34.2467 123.943 43.1318C132.783 51.9945 138.355 63.243 140.068 75.4264H141.549C139.866 63.2206 134.354 51.4485 125.005 42.0773C115.851 32.9079 104.198 27.1491 91.5737 25.4214Z" fill="#50A1B0"/>
        <path d="M140.068 91.5737C138.355 103.772 132.768 115.043 123.906 123.906L123.868 123.943C114.789 133.008 103.398 138.37 91.5737 140.046V141.549C103.78 139.866 115.552 134.354 124.923 124.998L124.96 124.96C134.339 115.582 139.859 103.795 141.541 91.5737H140.061H140.068Z" fill="#50A1B0"/>
        <path d="M75.4263 140.046C63.572 138.37 52.144 132.978 43.0569 123.868C34.2166 115.006 28.6447 103.757 26.932 91.5737H25.4512C27.134 103.78 32.646 115.552 41.9949 124.923C51.3736 134.324 63.1831 139.859 75.4263 141.549V140.046Z" fill="#50A1B0"/>
      </motion.g>
      
      {/* Flecha superior izquierda */}
      <motion.path
        d="M67.1765 43.9617L62.4423 48.6959C61.7991 49.3391 60.7595 49.3391 60.1163 48.6959L50.2963 38.8759L37.4921 26.0718C36.8489 25.4286 35.8093 25.4286 35.1661 26.0718L26.0791 35.1588C25.4359 35.802 25.4359 36.8416 26.0791 37.4848L41.8375 53.2432L48.7033 60.109C49.3465 60.7522 49.3465 61.7918 48.7033 62.435L43.969 67.1692C42.9294 68.2088 43.6698 69.9813 45.1357 69.9813H68.3582C69.2707 69.9813 70.0036 69.2484 70.0036 68.336V45.1135C70.0036 43.6476 68.2311 42.9146 67.1915 43.9467L67.1765 43.9617Z"
        fill="#F4F8F9"
        style={{ transformOrigin: 'bottom right' }}
        animate={isHovered ? { 
          y: [0, 4, 0],
          scale: [1, 1.15, 1]
        } : { 
          y: 0,
          scale: 1
        }}
        transition={{ 
          duration: 1.2, 
          repeat: isHovered ? Infinity : 0,
          repeatType: 'mirror',
          repeatDelay: 1.2,
          ease: 'easeOut'
        }}
      />

      {/* Flecha inferior derecha */}
      <motion.path
        d="M99.8232 123.046L104.557 118.311C105.201 117.668 106.24 117.668 106.883 118.311L116.703 128.131L129.508 140.935C130.151 141.579 131.19 141.579 131.834 140.935L140.921 131.848C141.564 131.205 141.564 130.166 140.921 129.522L125.162 113.764L118.296 106.898C117.653 106.255 117.653 105.215 118.296 104.572L123.031 99.838C124.07 98.7984 123.33 97.0259 121.864 97.0259H98.6415C97.729 97.0259 96.9961 97.7588 96.9961 98.6713V121.894C96.9961 123.36 98.7686 124.093 99.8082 123.061L99.8232 123.046Z"
        fill="#F4F8F9"
        style={{ transformOrigin: 'top left' }}
        animate={isHovered ? { 
          y: [0, -5, 0],
          scale: [1, 1.15, 1]
        } : { 
          y: 0,
          scale: 1
        }}
        transition={{ 
          duration: 1.2, 
          repeat: isHovered ? Infinity : 0,
          repeatType: 'mirror',
          repeatDelay: 1.2,
          ease: 'easeOut'
        }}
      />

      {/* Flecha inferior izquierda */}
      <motion.path
        d="M43.9617 99.8232L48.6959 104.557C49.3391 105.201 49.3391 106.24 48.6959 106.883L38.8759 116.703L26.0718 129.508C25.4286 130.151 25.4286 131.19 26.0718 131.834L35.1588 140.921C35.802 141.564 36.8416 141.564 37.4848 140.921L53.2432 125.162L60.109 118.296C60.7522 117.653 61.7918 117.653 62.435 118.296L67.1692 123.031C68.2088 124.07 69.9813 123.33 69.9813 121.864V98.6415C69.9813 97.729 69.2484 96.9961 68.336 96.9961H45.1135C43.6476 96.9961 42.9146 98.7686 43.9467 99.8082L43.9617 99.8232Z"
        fill="#F4F8F9"
        style={{ transformOrigin: 'top right' }}
        animate={isHovered ? { 
          y: [0, -5, 0],
          scale: [1, 1.15, 1]
        } : { 
          y: 0,
          scale: 1
        }}
        transition={{ 
          duration: 1.2, 
          repeat: isHovered ? Infinity : 0,
          repeatType: 'mirror',
          repeatDelay: 1.2,
          ease: 'easeOut'
        }}
      />

      {/* Flecha superior derecha */}
      <motion.path
        d="M123.046 67.1765L118.311 62.4423C117.668 61.7991 117.668 60.7595 118.311 60.1163L128.131 50.2963L140.935 37.4921C141.579 36.8489 141.579 35.8093 140.935 35.1661L131.848 26.0791C131.205 25.4359 130.166 25.4359 129.522 26.0791L113.764 41.8375L106.898 48.7033C106.255 49.3465 105.215 49.3465 104.572 48.7033L99.838 43.969C98.7984 42.9294 97.0259 43.6698 97.0259 45.1357V68.3582C97.0259 69.2707 97.7588 70.0036 98.6713 70.0036H121.894C123.36 70.0036 124.093 68.2311 123.061 67.1915L123.046 67.1765Z"
        fill="#F4F8F9"
        style={{ transformOrigin: 'bottom left' }}
        animate={isHovered ? { 
          y: [0, 4, 0],
          scale: [1, 1.15, 1]
        } : { 
          y: 0,
          scale: 1
        }}
        transition={{ 
          duration: 1.2, 
          repeat: isHovered ? Infinity : 0,
          repeatType: 'mirror',
          repeatDelay: 1.2,
          ease: 'easeOut'
        }}
      />
      
      {/* Diamante central */}
      <motion.path
        d="M101.7 78.8444L83.5037 60.6553L65.3072 78.8444C64.1404 80.0111 64.1404 81.9108 65.3072 83.0775L80.1157 97.8786L75.03 102.964L78.418 106.352L83.5037 101.267L88.5895 106.352L91.9775 102.964L86.8918 97.8786L101.7 83.0775C102.867 81.9108 102.867 80.0111 101.7 78.8444ZM83.5037 94.4906L69.9666 80.9609L83.5037 67.4313L97.0409 80.9609L83.5037 94.4906Z"
        fill="#50A1B0"
        animate={isHovered ? { scale: [1, 0.6, 1] } : { scale: 1 }}
        style={{ transformOrigin: 'center' }}
        transition={{ 
          duration: 1.2, 
          repeat: isHovered ? Infinity : 0,
          repeatType: 'mirror',
          repeatDelay: 1.2,
          ease: 'easeOut'
        }}
      />
    </svg>
  );
}

function ImpactResistSvg({ isHovered }: { isHovered: boolean }) {
  return (
    <svg 
      width="100%" 
      height="100%" 
      viewBox="0 0 146 187" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      {/* Flecha izquierda */}
      <motion.path
        d="M21.976 1.90569V62.6451C21.976 63.7019 21.1185 64.5508 20.0704 64.5508H12.309C10.6112 64.5508 9.76232 66.6038 10.9577 67.8078L29.9713 86.8214C30.7162 87.5663 31.9203 87.5663 32.6652 86.8214L51.6788 67.8078C52.8828 66.6038 52.0253 64.5508 50.3275 64.5508H42.5748C41.518 64.5508 40.6691 63.6933 40.6691 62.6451V1.90569C40.6864 0.857559 39.8289 0 38.7721 0H23.8817C22.8249 0 21.976 0.857559 21.976 1.90569Z"
        fill="#F4F8F9"
        animate={isHovered ? { y: [0, 50, 0] } : { y: 0 }}
        transition={{ 
          duration: 0.8, 
          repeat: isHovered ? Infinity : 0,
          repeatType: 'mirror',
          repeatDelay: 1.2,
          ease: 'easeOut'
        }}
      />
      
      {/* Flecha derecha */}
      <motion.path
        d="M97.3112 1.90569V62.6451C97.3112 63.7019 96.4537 64.5508 95.4056 64.5508H87.6442C85.9464 64.5508 85.0975 66.6038 86.2929 67.8078L105.306 86.8214C106.051 87.5663 107.255 87.5663 108 86.8214L127.014 67.8078C128.218 66.6038 127.36 64.5508 125.663 64.5508H117.91C116.853 64.5508 116.004 63.6933 116.004 62.6451V1.90569C116.004 0.848897 115.147 0 114.099 0H99.2083C98.1515 0 97.3026 0.857559 97.3026 1.90569H97.3112Z"
        fill="#F4F8F9"
        animate={isHovered ? { y: [0, 50, 0] } : { y: 0 }}
        transition={{ 
          duration: 0.8, 
          repeat: isHovered ? Infinity : 0,
          repeatType: 'mirror',
          repeatDelay: 1.2,
          ease: 'easeOut'
        }}
      />
      
      {/* Flecha central */}
      <motion.path
        d="M59.6482 20.5121V112.531C59.6482 113.588 58.7993 114.437 57.7425 114.437H49.9811C48.2833 114.437 47.4344 116.489 48.6298 117.694L67.6434 136.707C68.3883 137.452 69.5924 137.452 70.3373 136.707L89.3509 117.694C90.5549 116.489 89.6974 114.437 87.9996 114.437H80.2469C79.1901 114.437 78.3412 113.579 78.3412 112.531V20.5121C78.3412 19.4553 77.4837 18.6064 76.4355 18.6064H61.5452C60.4884 18.6064 59.6395 19.464 59.6395 20.5121H59.6482Z"
        fill="#F4F8F9"
        animate={isHovered ? { y: [0, -18.6, 0] } : { y: 0 }}
        transition={{ 
          duration: 0.8, 
          repeat: isHovered ? Infinity : 0,
          repeatType: 'mirror',
          repeatDelay: 1.2,
          ease: 'easeOut'
        }}
      />
      
      {/* Barra superior del suelo */}
      <motion.path
        d="M139.089 146H6.00291C2.6876 146 0 148.688 0 152.003V152.523C0 155.838 2.6876 158.526 6.00291 158.526H139.089C142.405 158.526 145.092 155.838 145.092 152.523V152.003C145.092 148.688 142.405 146 139.089 146Z"
        fill="#F4F8F9"
        animate={isHovered ? { y: [0, 6, 0] } : { y: 0 }}
        transition={{ 
          duration: 0.8, 
          repeat: isHovered ? Infinity : 0,
          repeatType: 'mirror',
          repeatDelay: 1.2,
          ease: 'easeOut'
        }}
      />
      
      {/* Barra inferior del suelo */}
      <motion.path
        d="M139.089 174.466H6.00291C2.6876 174.466 0 177.153 0 180.469V180.988C0 184.304 2.6876 186.991 6.00291 186.991H139.089C142.404 186.991 145.092 184.304 145.092 180.988V180.469C145.092 177.153 142.404 174.466 139.089 174.466Z"
        fill="#F4F8F9"
      />
    </svg>
  );
}

function ImpactFlexSvg({ isHovered }: { isHovered: boolean }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 131 173" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
      
      {/* Flecha izquierda */}
      <motion.path
        d="M23.226 1.7631V57.9579C23.226 58.9356 22.4326 59.721 21.4629 59.721H14.2823C12.7115 59.721 11.9262 61.6203 13.0321 62.7343L30.623 80.3252C31.3122 81.0144 32.4262 81.0144 33.1154 80.3252L50.7063 62.7343C51.8203 61.6203 51.0269 59.721 49.4561 59.721H42.2835C41.3058 59.721 40.5204 58.9276 40.5204 57.9579V1.7631C40.5365 0.793395 39.7431 0 38.7734 0H24.9971C24.0194 0 23.234 0.793395 23.234 1.7631H23.226Z"
        fill="#F4F8F9"
        animate={isHovered ? { y: [0, 38, 0] } : { y: 0 }}
        transition={{ 
          duration: 0.8, 
          repeat: isHovered ? Infinity : 0,
          repeatType: 'mirror',
          repeatDelay: 1.2,
          ease: 'easeOut'
        }}
      />
      
      {/* Flecha derecha */}
      <motion.path
        d="M92.9326 1.76261V57.9574C92.9326 58.9351 92.1392 59.7205 91.1695 59.7205H83.9888C82.4181 59.7205 81.6327 61.6198 82.7386 62.7338L100.33 80.3247C101.019 81.0139 102.133 81.0139 102.822 80.3247L120.413 62.7338C121.527 61.6198 120.733 59.7205 119.163 59.7205H111.99C111.012 59.7205 110.227 58.9271 110.227 57.9574V1.76261C110.227 0.784892 109.434 -0.000488281 108.464 -0.000488281H94.6877C93.7099 -0.000488281 92.9246 0.792906 92.9246 1.76261H92.9326Z"
        fill="#F4F8F9"
        animate={isHovered ? { y: [0, 49, 0] } : { y: 0 }}
        transition={{ 
          duration: 0.8, 
          repeat: isHovered ? Infinity : 0,
          repeatType: 'mirror',
          repeatDelay: 1.2,
          ease: 'easeOut'
        }}
      />
      
      {/* Flecha central */}
      <motion.path
        d="M58.0795 18.977V104.111C58.0795 105.088 57.2942 105.874 56.3164 105.874H49.1358C47.5651 105.874 46.7797 107.773 47.8856 108.887L65.4765 126.478C66.1658 127.167 67.2797 127.167 67.9689 126.478L85.5598 108.887C86.6738 107.773 85.8804 105.874 84.3096 105.874H77.137C76.1593 105.874 75.3739 105.08 75.3739 104.111V18.977C75.3739 17.9992 74.5805 17.2139 73.6108 17.2139H59.8346C58.8569 17.2139 58.0715 18.0073 58.0715 18.977H58.0795Z"
        fill="#F4F8F9"
        animate={isHovered ? { y: [0, -17.2, 0] } : { y: 0 }}
        transition={{ 
          duration: 0.8, 
          repeat: isHovered ? Infinity : 0,
          repeatType: 'mirror',
          repeatDelay: 1.2,
          ease: 'easeOut'
        }}
      />

      {/* Curva superior */}
      <motion.path
        d="M64.5145 153.013C38.7412 153.013 12.8798 143.5 2.81407 139.341C0.417856 138.355 -0.664046 135.574 0.42587 133.226L0.994871 132C2.02067 129.796 4.58518 128.794 6.82913 129.716C16.2377 133.563 40.8409 142.595 64.5145 142.595C88.1882 142.595 114.378 133.426 124.171 129.604C126.439 128.722 128.996 129.78 129.974 132.008L130.519 133.242C131.552 135.598 130.43 138.347 128.034 139.293C117.624 143.388 90.4321 153.013 64.5226 153.013H64.5145Z"
        fill="#F4F8F9"
        style={{ transformOrigin: 'right center' }}
        animate={isHovered ? { 
          rotate: [0, 10, 0],
          y: [0, -6, 0]
        } : { 
          rotate: 0,
          y: 0
        }}
        transition={{ 
          duration: 0.8, 
          repeat: isHovered ? Infinity : 0,
          repeatType: 'mirror',
          repeatDelay: 1.2,
          ease: 'easeOut'
        }}
      />
      
      {/* Curva inferior */}
      <path
        d="M64.5145 173C38.7412 173 12.8798 163.487 2.81407 159.328C0.417856 158.342 -0.664046 155.561 0.42587 153.213L0.994871 151.987C2.02067 149.783 4.58518 148.782 6.82913 149.703C16.2377 153.55 40.8409 162.582 64.5145 162.582C88.1882 162.582 114.378 153.414 124.171 149.591C126.439 148.709 128.996 149.767 129.974 151.995L130.519 153.229C131.552 155.586 130.43 158.334 128.034 159.28C117.624 163.375 90.4321 173 64.5226 173H64.5145Z"
        fill="#F4F8F9"
      />
    </svg>
  );
}