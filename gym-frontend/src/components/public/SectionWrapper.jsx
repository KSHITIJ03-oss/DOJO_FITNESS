/**
 * Section wrapper component for consistent spacing.
 */
/**
 * This file defines the SectionWrapper component, a React functional component
 * designed to provide consistent spacing, layout, and background color treatment
 * for different sections of a web page. It is commonly used to wrap content
 * sections in the frontend, especially for layouts using Tailwind CSS utility classes.
 *
 * Detailed Line-by-Line Explanation:
 *
 * 1-3: Documentation comment explaining the purpose of this component file.
 * 
 * 5-25: The SectionWrapper component definition.
 *   - Line 7: The component accepts four props:
 *       - children: The inner content or React nodes to be rendered inside the section.
 *       - className: (string, optional) Additional CSS/tailwind classes to apply.
 *       - bgColor: (string, optional, defaults to 'transparent') Determines the background color style.
 *       - padding: (string, optional, defaults to 'py-20') Controls the vertical padding for the section.
 *   - Line 8-13: Defines a mapping object (bgClasses) correlating the bgColor prop
 *     values ('transparent', 'dark', 'darker', 'gray') to their respective Tailwind classes.
 *   - Line 15-20: The component's returned JSX.
 *     - The <section> gets dynamic background, padding, and custom classes.
 *     - Inside, a div applies max-width constraints and horizontal padding for responsive layout.
 *     - The {children} are injected (placed) here, meaning any nested content passed to SectionWrapper
 *       will be rendered within this layout structure.
 *   - Line 23: Closes the component function.
 * 
 * 27: Exports SectionWrapper as default, so it can be imported and used elsewhere.
 *
 * Summary of the props used:
 * - children: The content elements to be wrapped by the section (ReactNode).
 * - className: Additional CSS or Tailwind utility classes (string, optional, defaults to '').
 * - bgColor: Which background color to use (one of: 'transparent', 'dark', 'darker', 'gray'; defaults to 'transparent').
 * - padding: Tailwind padding classes to apply (string, optional, defaults to 'py-20').
 */


const SectionWrapper = ({
  children,
  className = '',
  bgColor = 'transparent',
  padding = 'py-20',
}) => {
  const bgClasses = {
    transparent: 'bg-transparent',
    dark: 'bg-gray-900',
    darker: 'bg-black',
    gray: 'bg-gray-800',
  };

  return (
    <section className={`${bgClasses[bgColor]} ${padding} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
};

export default SectionWrapper;

