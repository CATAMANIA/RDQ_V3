function Frame1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start leading-[0] left-[40px] not-italic top-[93px]">
      <div className="font-['Inter:Bold',_sans-serif] font-bold relative shrink-0 text-[#2e5983] text-[28px] w-full">
        <p className="leading-[normal]">Titre 1 - H1</p>
      </div>
      <div className="font-['Inter:Bold',_sans-serif] font-bold relative shrink-0 text-[#1fb0de] text-[20px] w-full">
        <p className="leading-[normal]">Titre 2 - H2</p>
      </div>
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[#001128] text-[16px] w-full">
        <p className="leading-[normal]">Titre 3 - H3</p>
      </div>
      <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[14px] text-black w-full">
        <p className="leading-[normal]">Titre 4 - H4</p>
      </div>
      <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#818c8b] text-[12px] w-full">
        <p className="leading-[normal]">Texte normal - P</p>
      </div>
      <div className="font-['Inter:Bold',_sans-serif] font-bold relative shrink-0 text-[#818c8b] text-[12px] w-full">
        <p className="leading-[normal]">Texte bold - B / Strong</p>
      </div>
    </div>
  );
}

export default function Frame2() {
  return (
    <div className="bg-white relative size-full">
      <Frame1 />
    </div>
  );
}