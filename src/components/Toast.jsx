import useStore from '../store/store'

export default function Toast() {
    const toast = useStore((s) => s.toast)
    if (!toast) return null

    return (
        <div className="toast">
            <p style={{ fontSize: '0.9rem' }}>{toast}</p>
        </div>
    )
}
