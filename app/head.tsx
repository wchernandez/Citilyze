export default function Head() {
  // runs before React hydration to avoid flash
  const script = `(function(){
    try{
      const t=localStorage.getItem('theme');
      if(t==='dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)){
        document.documentElement.classList.add('dark');
      }
    }catch(e){}
  })()`;

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}
