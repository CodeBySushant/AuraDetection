import sys
import json
from aura_pipeline import run_aura_pipeline

def main():
    image_path = sys.argv[1]

    final_image, emotion, confidence, chakra = run_aura_pipeline(image_path)

    output = {
        "emotion": emotion,
        "confidence": confidence,
        "chakra": chakra["chakra"],
        "color": chakra["hex"]
    }

    print(json.dumps(output))

if __name__ == "__main__":
    main()