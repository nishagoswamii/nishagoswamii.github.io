
import * as React from "react"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
    const [theme, setTheme] = React.useState<"light" | "dark">("light")

    React.useEffect(() => {
        const isDark = document.documentElement.classList.contains("dark")
        setTheme(isDark ? "dark" : "light")
    }, [])

    const toggleTheme = () => {
        const isDark = theme === "dark"
        document.documentElement.classList[isDark ? "remove" : "add"]("dark")
        localStorage.setItem("theme", isDark ? "light" : "dark")
        setTheme(isDark ? "light" : "dark")
    }

    return (
        <button
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label="Toggle theme"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>
    )
}
