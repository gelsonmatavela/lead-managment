export const AnimatedBackground = () => (
  <div className='fixed inset-0 z-0'>
    <div className='absolute inset-0 bg-black' />
    <div
      className='absolute inset-0 bg-gradient-to-br from-black via-orange-900/15 to-black animate-pulse'
      style={{ animationDelay: '2s', animationDuration: '6s' }}
    />
    <div
      className='absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent animate-ping'
      style={{ animationDuration: '8s' }}
    />
    <div
      className='absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-yellow-500/3 via-transparent to-transparent animate-pulse'
      style={{ animationDelay: '4s', animationDuration: '10s' }}
    />
  </div>
);