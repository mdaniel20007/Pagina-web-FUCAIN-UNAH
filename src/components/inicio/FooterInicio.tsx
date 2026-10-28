import { inicio } from '../../data/inicio'

export default function FooterInicio({ bg = '#FFFFFF' }: { bg?: string }) {
  return (
    <footer style={{ background: bg }}>
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="h-px bg-fc-navy/10" />
        <div className="flex flex-wrap items-center justify-center gap-7 pb-7 pt-10">
          <img src="/img/fucain-color.png" alt="FUCAIN" className="size-[84px] object-contain" />
          <span className="h-10 w-px bg-fc-navy/15" />
          <img src="/img/voae.png" alt="VOAE · Vicerrectoría de Orientación y Asuntos Estudiantiles" className="h-[54px] w-auto" />
          <span className="h-10 w-px bg-fc-navy/15" />
          <img src="/img/unah-horizontal.png" alt="UNAH · Universidad Nacional Autónoma de Honduras" className="h-16 w-auto" />
        </div>
        <div className="flex flex-wrap justify-between gap-x-6 gap-y-2 pb-7 text-[13px] leading-normal text-fc-gray">
          <span>{inicio.nombreCompleto} · FUCAIN {inicio.edicion}</span>
          <span>© {inicio.edicion} FUCAIN · Universidad Nacional Autónoma de Honduras</span>
        </div>
      </div>
      <div
        className="fx-fillet h-[3px]"
        style={{
          background:
            'linear-gradient(90deg,#E84E2B 0 10%,#F5A12F 10% 20%,#FBC102 20% 30%,#12AC9C 30% 40%,#85328A 40% 50%,#E84E2B 50% 60%,#F5A12F 60% 70%,#FBC102 70% 80%,#12AC9C 80% 90%,#85328A 90% 100%)',
          backgroundSize: '200% 100%',
        }}
      />
      <div
        className="h-14 shadow-[inset_0_-1px_0_rgba(11,22,49,.08)]"
        style={{ background: `${bg} url('/img/franja-fucain.png') repeat-x center / auto 38px` }}
      />
    </footer>
  )
}
