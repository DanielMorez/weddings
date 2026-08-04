import imgHeroBlock from "./d8c693345d1907997218ddbfa8cb1df89ba119c7.png";
import imgFormalPortrait from "./4875327f91ae4c0ef4f93d30c8e1ccf00ee8e0af.png";
import imgTimerBlock from "./99b2d9dbff6b24a25c62c037179ed9d4a4d556af.png";

function HeroContent() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-center relative shrink-0 w-full" data-name="hero-content">
      <p className="[word-break:break-word] font-['Cormorant_Garamond:Medium',sans-serif] font-medium leading-[normal] min-w-full relative shrink-0 text-[#fcfbfa] text-[15px] text-center uppercase w-[min-content]">Свадебное торжество</p>
      <p className="[word-break:break-word] font-['Pinyon_Script:Regular',sans-serif] leading-none min-w-full not-italic relative shrink-0 text-[#fcfbfa] text-[80px] text-center w-[min-content]">{`Rasim & Anna`}</p>
      <div className="h-0 relative shrink-0 w-[80px]" data-name="hero-divider">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 80 1" width="80">
            <line id="hero-divider" opacity="0.5" stroke="#FCFBFA" x2="80" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] font-['Cormorant_Garamond:Regular',sans-serif] font-normal leading-[normal] min-w-full relative shrink-0 text-[#fcfbfa] text-[18px] text-center w-[min-content]">19 . 09 . 2026</p>
    </div>
  );
}

function HeroBlock() {
  return (
    <div className="content-stretch flex flex-col h-[650px] items-center justify-center pb-[80px] pt-[120px] px-[32px] relative shrink-0 w-full" data-name="hero-block">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <img alt="" className="absolute max-w-none object-cover size-full" src={imgHeroBlock} />
        <div className="absolute bg-[rgba(77,11,18,0.5)] inset-0" />
      </div>
      <HeroContent />
    </div>
  );
}

function TextGroup() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-center relative shrink-0 text-center w-full" data-name="text-group">
      <p className="font-['Cormorant_Garamond:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#6e1c24] text-[13px] uppercase w-full">Приглашение</p>
      <p className="font-['Cormorant_Garamond:Regular',sans-serif] font-normal leading-[1.2] relative shrink-0 text-[#1a1a1a] text-[38px] w-full">Дорогие гости!</p>
      <p className="font-['Cormorant_Garamond:Regular',sans-serif] font-normal leading-[1.7] relative shrink-0 text-[18px] text-[rgba(26,26,26,0.6)] w-full">Один день в нашей жизни будет особенным, и мы хотим разделить его тепло с вами. Мы рады пригласить вас на торжество, посвященное началу нашей новой совместной главы. Ваши улыбки, поддержка и объятия станут главным украшением нашего праздника.</p>
    </div>
  );
}

function DateBadge() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-center px-[24px] py-[20px] relative rounded-[2px] shrink-0 w-full" data-name="date-badge">
      <div aria-hidden className="absolute border border-[#6e1c24] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <p className="[word-break:break-word] font-['Cormorant_Garamond:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#6e1c24] text-[20px] text-center w-full">19 СЕНТЯБРЯ 2026</p>
      <p className="[word-break:break-word] font-['Cormorant_Garamond:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#1a1a1a] text-[13px] text-center uppercase w-full">Суббота • 16:30</p>
    </div>
  );
}

function PhotoFrame() {
  return (
    <div className="content-stretch flex flex-col h-[460px] items-start p-[8px] relative rounded-[2px] shrink-0 w-full" data-name="photo-frame">
      <div aria-hidden className="absolute border border-[#6e1c24] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="flex-[1_0_0] min-h-px relative rounded-[1px] w-full" data-name="formal-portrait">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[1px] size-full" src={imgFormalPortrait} />
      </div>
    </div>
  );
}

function InvitationBlock() {
  return (
    <div className="bg-[#fcfbfa] content-stretch flex flex-col gap-[32px] items-start px-[32px] py-[64px] relative shrink-0 w-full" data-name="invitation-block">
      <TextGroup />
      <DateBadge />
      <PhotoFrame />
    </div>
  );
}

function DividerWrap() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="divider-wrap">
      <svg className="absolute block inset-0 size-full" fill="none" height="64" preserveAspectRatio="none" viewBox="0 0 390 64" width="390">
        <g id="divider-wrap">
          <line id="line" stroke="#F0EAE6" x1="32" x2="358" y1="31.5" y2="31.5" />
        </g>
      </svg>
    </div>
  );
}

function HeaderGroup() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-center leading-[normal] relative shrink-0 text-center w-full" data-name="header-group">
      <p className="font-['Cormorant_Garamond:SemiBold',sans-serif] font-semibold relative shrink-0 text-[#6e1c24] text-[13px] uppercase w-full">Программа дня</p>
      <p className="font-['Cormorant_Garamond:Regular',sans-serif] font-normal relative shrink-0 text-[#1a1a1a] text-[36px] w-full">Детали события</p>
    </div>
  );
}

function Details() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="details">
      <p className="font-['Cormorant_Garamond:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#1a1a1a] text-[18px] w-full">Сбор гостей</p>
      <p className="font-['Cormorant_Garamond:Regular',sans-serif] font-normal leading-[1.5] relative shrink-0 text-[15px] text-[rgba(26,26,26,0.6)] w-full">Приветственные напитки и музыкальная атмосфера</p>
    </div>
  );
}

function TimelineRow() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="timeline-row">
      <p className="font-['Cormorant_Garamond:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#6e1c24] text-[18px] w-[65px]">16:30</p>
      <Details />
    </div>
  );
}

function Details1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="details">
      <p className="font-['Cormorant_Garamond:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#1a1a1a] text-[18px] w-full">Начало</p>
      <p className="font-['Cormorant_Garamond:Regular',sans-serif] font-normal leading-[1.5] relative shrink-0 text-[15px] text-[rgba(26,26,26,0.6)] w-full">Торжественная церемония бракосочетания и праздничный ужин</p>
    </div>
  );
}

function TimelineRow1() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="timeline-row">
      <p className="font-['Cormorant_Garamond:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#6e1c24] text-[18px] w-[65px]">17:00</p>
      <Details1 />
    </div>
  );
}

function Details2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="details">
      <p className="font-['Cormorant_Garamond:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#1a1a1a] text-[18px] w-full">Окончание вечера</p>
      <p className="font-['Cormorant_Garamond:Regular',sans-serif] font-normal leading-[1.5] relative shrink-0 text-[15px] text-[rgba(26,26,26,0.6)] w-full">Финальные аккорды праздника, теплые проводы и салют</p>
    </div>
  );
}

function TimelineRow2() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="timeline-row">
      <p className="font-['Cormorant_Garamond:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#6e1c24] text-[18px] w-[65px]">23:00</p>
      <Details2 />
    </div>
  );
}

function TimelineContainer() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="timeline-container">
      <TimelineRow />
      <TimelineRow1 />
      <TimelineRow2 />
    </div>
  );
}

function VenueText() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-center leading-[normal] relative shrink-0 text-center w-full" data-name="venue-text">
      <p className="font-['Cormorant_Garamond:SemiBold',sans-serif] font-semibold relative shrink-0 text-[#6e1c24] text-[12px] uppercase w-full">Место проведения</p>
      <p className="font-['Cormorant_Garamond:Regular',sans-serif] font-normal relative shrink-0 text-[#1a1a1a] text-[26px] w-full">Банкетный зал Диэл</p>
      <p className="font-['Cormorant_Garamond:Regular',sans-serif] font-normal relative shrink-0 text-[16px] text-[rgba(26,26,26,0.6)] w-full">Улица Мира, 2а лит В</p>
    </div>
  );
}

function MapButton() {
  return (
    <div className="bg-[#6e1c24] content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.15)] flex items-center justify-center px-[32px] py-[16px] relative rounded-[2px] shrink-0 w-full" data-name="map-button">
      <p className="[word-break:break-word] font-['Cormorant_Garamond:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#fcfbfa] text-[13px] uppercase whitespace-nowrap">Посмотреть на карте</p>
    </div>
  );
}

function VenueCard() {
  return (
    <div className="bg-[#fcfbfa] content-stretch flex flex-col gap-[20px] items-center p-[24px] relative rounded-[2px] shrink-0 w-full" data-name="venue-card">
      <div aria-hidden className="absolute border border-[#6e1c24] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <VenueText />
      <MapButton />
    </div>
  );
}

function ScheduleLocationBlock() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-start px-[32px] py-[64px] relative shrink-0 w-full" data-name="schedule-location-block">
      <HeaderGroup />
      <TimelineContainer />
      <VenueCard />
    </div>
  );
}

function DividerWrap1() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="divider-wrap">
      <svg className="absolute block inset-0 size-full" fill="none" height="64" preserveAspectRatio="none" viewBox="0 0 390 64" width="390">
        <g id="divider-wrap">
          <line id="line" stroke="#F0EAE6" x1="32" x2="358" y1="31.5" y2="31.5" />
        </g>
      </svg>
    </div>
  );
}

function DressCodeBorderBox() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-center p-[24px] relative rounded-[2px] shrink-0 w-full" data-name="dress-code-border-box">
      <div aria-hidden className="absolute border border-[#6e1c24] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <p className="[word-break:break-word] font-['Cormorant_Garamond:SemiBold',sans-serif] font-semibold leading-[normal] min-w-full relative shrink-0 text-[#6e1c24] text-[14px] text-center uppercase w-[min-content]">Пожелания к дресс-коду</p>
      <div className="h-0 relative shrink-0 w-[40px]" data-name="dress-divider">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 40 1" width="40">
            <line id="dress-divider" opacity="0.3" stroke="#6E1C24" x2="40" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] font-['Cormorant_Garamond:Regular',sans-serif] font-normal leading-[1.6] min-w-full relative shrink-0 text-[#1a1a1a] text-[17px] text-center w-[min-content]">Просим вас по возможности избегать преобладания черного, белого и очень яркого цвета в одежде.</p>
    </div>
  );
}

function DressCodeBlock() {
  return (
    <div className="bg-[#fcfbfa] content-stretch flex flex-col items-start px-[32px] py-[64px] relative shrink-0 w-full" data-name="dress-code-block">
      <DressCodeBorderBox />
    </div>
  );
}

function RsvpHeader() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-center leading-[normal] relative shrink-0 text-center w-full" data-name="rsvp-header">
      <p className="font-['Cormorant_Garamond:SemiBold',sans-serif] font-semibold relative shrink-0 text-[#6e1c24] text-[13px] uppercase w-full">Анкета гостя</p>
      <p className="font-['Cormorant_Garamond:Regular',sans-serif] font-normal relative shrink-0 text-[#1a1a1a] text-[28px] w-full">Пожалуйста, подтвердите присутствие</p>
    </div>
  );
}

function InputBox() {
  return (
    <div className="bg-[#fcfbfa] content-stretch flex flex-col h-[48px] items-start relative shrink-0 w-full" data-name="input-box">
      <div aria-hidden className="absolute border-[#eae7e2] border-b border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] flex-[1_0_0] font-['Cormorant_Garamond:Italic',sans-serif] font-normal italic leading-[normal] min-h-px relative text-[14px] text-[rgba(26,26,26,0.5)] w-full">Имя Фамилия</p>
    </div>
  );
}

function FieldContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="field-container">
      <p className="[word-break:break-word] font-['Cormorant_Garamond:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#1a1a1a] text-[15px] w-full">Как к вам обращаться (Имя / Фамилия)?</p>
      <InputBox />
    </div>
  );
}

function Chip() {
  return (
    <div className="bg-[#6e1c24] content-stretch flex items-start px-[16px] py-[10px] relative rounded-[30px] shrink-0" data-name="chip">
      <div aria-hidden className="absolute border border-[#6e1c24] border-solid inset-0 pointer-events-none rounded-[30px]" />
      <p className="[word-break:break-word] font-['Cormorant_Garamond:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#fcfbfa] text-[14px] whitespace-nowrap">С удовольствием буду</p>
    </div>
  );
}

function Chip1() {
  return (
    <div className="bg-[#fcfbfa] content-stretch flex items-start px-[16px] py-[10px] relative rounded-[30px] shrink-0" data-name="chip">
      <div aria-hidden className="absolute border border-[#eae7e2] border-solid inset-0 pointer-events-none rounded-[30px]" />
      <p className="[word-break:break-word] font-['Cormorant_Garamond:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#1a1a1a] text-[14px] whitespace-nowrap">К сожалению, не смогу</p>
    </div>
  );
}

function ChipsRow() {
  return (
    <div className="content-start flex flex-wrap gap-[8px] items-start relative shrink-0 w-full" data-name="chips-row">
      <Chip />
      <Chip1 />
    </div>
  );
}

function QuestionGroup() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="question-group">
      <p className="[word-break:break-word] font-['Cormorant_Garamond:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#1a1a1a] text-[15px] w-full">Планируете ли вы присутствовать?</p>
      <ChipsRow />
    </div>
  );
}

function Chip2() {
  return (
    <div className="bg-[#6e1c24] content-stretch flex items-start px-[16px] py-[10px] relative rounded-[30px] shrink-0" data-name="chip">
      <div aria-hidden className="absolute border border-[#6e1c24] border-solid inset-0 pointer-events-none rounded-[30px]" />
      <p className="[word-break:break-word] font-['Cormorant_Garamond:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#fcfbfa] text-[14px] whitespace-nowrap">Вино</p>
    </div>
  );
}

function Chip3() {
  return (
    <div className="bg-[#fcfbfa] content-stretch flex items-start px-[16px] py-[10px] relative rounded-[30px] shrink-0" data-name="chip">
      <div aria-hidden className="absolute border border-[#eae7e2] border-solid inset-0 pointer-events-none rounded-[30px]" />
      <p className="[word-break:break-word] font-['Cormorant_Garamond:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#1a1a1a] text-[14px] whitespace-nowrap">Шампанское</p>
    </div>
  );
}

function Chip4() {
  return (
    <div className="bg-[#fcfbfa] content-stretch flex items-start px-[16px] py-[10px] relative rounded-[30px] shrink-0" data-name="chip">
      <div aria-hidden className="absolute border border-[#eae7e2] border-solid inset-0 pointer-events-none rounded-[30px]" />
      <p className="[word-break:break-word] font-['Cormorant_Garamond:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#1a1a1a] text-[14px] whitespace-nowrap">Крепкий алкоголь</p>
    </div>
  );
}

function Chip5() {
  return (
    <div className="bg-[#fcfbfa] content-stretch flex items-start px-[16px] py-[10px] relative rounded-[30px] shrink-0" data-name="chip">
      <div aria-hidden className="absolute border border-[#eae7e2] border-solid inset-0 pointer-events-none rounded-[30px]" />
      <p className="[word-break:break-word] font-['Cormorant_Garamond:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#1a1a1a] text-[14px] whitespace-nowrap">Безалкогольные напитки</p>
    </div>
  );
}

function ChipsWrap() {
  return (
    <div className="content-start flex flex-wrap gap-[8px] items-start relative shrink-0 w-full" data-name="chips-wrap">
      <Chip2 />
      <Chip3 />
      <Chip4 />
      <Chip5 />
    </div>
  );
}

function QuestionGroup1() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="question-group">
      <p className="[word-break:break-word] font-['Cormorant_Garamond:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#1a1a1a] text-[15px] w-full">Будете ли вы алкоголь? Если да, то какой напиток предпочитаете?</p>
      <ChipsWrap />
    </div>
  );
}

function InputBox1() {
  return (
    <div className="bg-[#fcfbfa] content-stretch flex flex-col h-[48px] items-start relative shrink-0 w-full" data-name="input-box">
      <div aria-hidden className="absolute border-[#eae7e2] border-b border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] flex-[1_0_0] font-['Cormorant_Garamond:Italic',sans-serif] font-normal italic leading-[normal] min-h-px relative text-[14px] text-[rgba(26,26,26,0.5)] w-full">Например: орехи, морепродукты</p>
    </div>
  );
}

function FieldContainer1() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="field-container">
      <p className="[word-break:break-word] font-['Cormorant_Garamond:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#1a1a1a] text-[15px] w-full">Есть ли у вас аллергия? Если да, то на что?</p>
      <InputBox1 />
    </div>
  );
}

function InputBox2() {
  return (
    <div className="bg-[#fcfbfa] content-stretch flex flex-col h-[48px] items-start relative shrink-0 w-full" data-name="input-box">
      <div aria-hidden className="absolute border-[#eae7e2] border-b border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] flex-[1_0_0] font-['Cormorant_Garamond:Italic',sans-serif] font-normal italic leading-[normal] min-h-px relative text-[14px] text-[rgba(26,26,26,0.5)] w-full">Имя Фамилия партнера</p>
    </div>
  );
}

function FieldContainer2() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="field-container">
      <p className="[word-break:break-word] font-['Cormorant_Garamond:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#1a1a1a] text-[15px] w-full">Будет ли у вас +1? Если да, как к нему / ней обращаться?</p>
      <InputBox2 />
    </div>
  );
}

function SubmitButton() {
  return (
    <div className="bg-[#6e1c24] content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.15)] flex items-center justify-center py-[16px] relative rounded-[2px] shrink-0 w-full" data-name="submit-button">
      <p className="[word-break:break-word] font-['Cormorant_Garamond:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#fcfbfa] text-[14px] uppercase whitespace-nowrap">Отправить ответ</p>
    </div>
  );
}

function RsvpForm() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="rsvp-form">
      <FieldContainer />
      <QuestionGroup />
      <QuestionGroup1 />
      <FieldContainer1 />
      <FieldContainer2 />
      <SubmitButton />
    </div>
  );
}

function RsvpSection() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start px-[24px] py-[64px] relative shrink-0 w-full" data-name="rsvp-section">
      <RsvpHeader />
      <RsvpForm />
    </div>
  );
}

function GiftsContentBox() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-center p-[24px] relative rounded-[2px] shrink-0 w-full" data-name="gifts-content-box">
      <div aria-hidden className="absolute border border-[#f0eae6] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <p className="[word-break:break-word] font-['Cormorant_Garamond:SemiBold',sans-serif] font-semibold leading-[normal] min-w-full relative shrink-0 text-[#6e1c24] text-[13px] text-center uppercase w-[min-content]">Подарки</p>
      <div className="h-0 relative shrink-0 w-[40px]" data-name="gifts-divider">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 40 1" width="40">
            <line id="dress-divider" opacity="0.3" stroke="#6E1C24" x2="40" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] font-['Cormorant_Garamond:Regular',sans-serif] font-normal leading-[1.6] min-w-full relative shrink-0 text-[#1a1a1a] text-[18px] text-center w-[min-content]">Ваши улыбки и прекрасное настроение - главный подарок для нас. Если вы хотите поддержать начало нашей семейной истории, мы будем особенно рады тому, что помещается в конверте.</p>
    </div>
  );
}

function GiftsSection() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[64px] relative shrink-0 w-full" data-name="gifts-section">
      <GiftsContentBox />
    </div>
  );
}

function CountdownUnit() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[70px]" data-name="countdown-unit">
      <p className="font-['Cormorant_Garamond:Medium',sans-serif] font-medium relative shrink-0 text-[36px]">25</p>
      <p className="font-['Cormorant_Garamond:Regular',sans-serif] font-normal opacity-70 relative shrink-0 text-[13px] uppercase">Дней</p>
    </div>
  );
}

function CountdownUnit1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[70px]" data-name="countdown-unit">
      <p className="font-['Cormorant_Garamond:Medium',sans-serif] font-medium relative shrink-0 text-[36px]">14</p>
      <p className="font-['Cormorant_Garamond:Regular',sans-serif] font-normal opacity-70 relative shrink-0 text-[13px] uppercase">Часов</p>
    </div>
  );
}

function CountdownUnit2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[70px]" data-name="countdown-unit">
      <p className="font-['Cormorant_Garamond:Medium',sans-serif] font-medium relative shrink-0 text-[36px]">48</p>
      <p className="font-['Cormorant_Garamond:Regular',sans-serif] font-normal opacity-70 relative shrink-0 text-[13px] uppercase">Минут</p>
    </div>
  );
}

function CountdownRow() {
  return (
    <div className="content-stretch flex gap-[24px] items-start justify-center relative shrink-0 whitespace-nowrap" data-name="countdown-row">
      <CountdownUnit />
      <CountdownUnit1 />
      <CountdownUnit2 />
    </div>
  );
}

function TimerContent() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[28px] items-center leading-[normal] relative shrink-0 text-[#fcfbfa] text-center w-full" data-name="timer-content">
      <p className="font-['Cormorant_Garamond:Regular',sans-serif] font-normal min-w-full relative shrink-0 text-[20px] w-[min-content]">До начала свадьбы осталось</p>
      <CountdownRow />
    </div>
  );
}

function TimerBlock() {
  return (
    <div className="content-stretch drop-shadow-[0px_8px_12px_rgba(110,28,36,0.2)] flex flex-col h-[340px] items-center justify-center px-[32px] py-[64px] relative shrink-0 w-full" data-name="timer-block">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <img alt="" className="absolute max-w-none object-cover size-full" src={imgTimerBlock} />
        <div className="absolute bg-[rgba(26,5,8,0.82)] inset-0" />
      </div>
      <TimerContent />
    </div>
  );
}

function CoordinatorGroup() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center leading-[normal] relative shrink-0 w-full" data-name="coordinator-group">
      <p className="font-['Cormorant_Garamond:SemiBold',sans-serif] font-semibold relative shrink-0 text-[#6e1c24] text-[13px] uppercase">Свадебный координатор</p>
      <p className="font-['Cormorant_Garamond:Medium',sans-serif] font-medium relative shrink-0 text-[#1a1a1a] text-[18px]">Арина +7 (999) 601-20-53</p>
    </div>
  );
}

function EmailGroup() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-full" data-name="email-group">
      <p className="font-['Cormorant_Garamond:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#6e1c24] text-[13px] uppercase">Электронная почта</p>
      <a className="block font-['Cormorant_Garamond:Medium',sans-serif] font-medium leading-[0] relative shrink-0 text-[#1a1a1a] text-[18px]" href="mailto:anna.ledenyova.99@mail.ru" target="_blank">
        <p className="[text-underline-position:from-font] cursor-pointer decoration-from-font decoration-solid leading-[normal] underline">anna.ledenyova.99@mail.ru</p>
      </a>
    </div>
  );
}

function ContactsContainer() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[20px] items-center relative shrink-0 text-center w-full whitespace-nowrap" data-name="contacts-container">
      <CoordinatorGroup />
      <EmailGroup />
    </div>
  );
}

function FooterBlock() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center px-[32px] py-[64px] relative shrink-0 w-full" data-name="footer-block">
      <div className="h-0 relative shrink-0 w-[32px]" data-name="footer-accent-line">
        <div className="absolute inset-[-1.5px_0_0_0]">
          <svg className="block size-full" fill="none" height="1.5" preserveAspectRatio="none" viewBox="0 0 32 1.5" width="32">
            <line id="footer-accent-line" stroke="#6E1C24" strokeWidth="1.5" x2="32" y1="0.75" y2="0.75" />
          </svg>
        </div>
      </div>
      <ContactsContainer />
    </div>
  );
}

export default function MobileWeddingV() {
  return (
    <div className="bg-[#fcfbfa] content-stretch flex flex-col items-start relative size-full" data-name="mobile-wedding-v2">
      <HeroBlock />
      <InvitationBlock />
      <DividerWrap />
      <ScheduleLocationBlock />
      <DividerWrap1 />
      <DressCodeBlock />
      <RsvpSection />
      <GiftsSection />
      <TimerBlock />
      <FooterBlock />
    </div>
  );
}