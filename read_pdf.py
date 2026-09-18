import fitz
doc = fitz.open("Frontend_UX_Design_Challenge_OT_Security (1).pdf")
for i in range(len(doc)):
    print(f"\n=== PAGE {i+1} ===")
    print(doc[i].get_text())
