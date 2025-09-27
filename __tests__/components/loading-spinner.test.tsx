import { render, screen } from "@testing-library/react";
import LoadingSpinner from "@/components/loading-spinner";

describe("LoadingSpinner", () => {
  it("renders loading spinner", () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole("status", { hidden: true });
    expect(spinner).toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    render(<LoadingSpinner />);

    const container = screen.getByText("Loading...", { hidden: true });
    expect(container).toBeInTheDocument();
  });
});
