import React from "react";

interface SocialLinks {
  facebook: string;
  twitter: string;
  linkedin: string;
}

interface TeamMember {
  id: number;
  name: string;
  position: string;
  image: string;
  socialLinks: SocialLinks;
}

const TeamSection: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Joshua Stefan",
      position: "Web Development",
      image: "/assets/img/team/team-1.jpg",
      socialLinks: {
        facebook: "#",
        twitter: "#",
        linkedin: "#",
      },
    },
    {
      id: 2,
      name: "Sheena Anderson",
      position: "Marketing",
      image: "/assets/img/team/team-2.jpg",
      socialLinks: {
        facebook: "#",
        twitter: "#",
        linkedin: "#",
      },
    },
    {
      id: 3,
      name: "Evan Smith",
      position: "Content",
      image: "/assets/img/team/team-3.jpg",
      socialLinks: {
        facebook: "#",
        twitter: "#",
        linkedin: "#",
      },
    },
    {
      id: 4,
      name: "Kaylie Jones",
      position: "Accountant",
      image: "/assets/img/team/team-4.jpg",
      socialLinks: {
        facebook: "#",
        twitter: "#",
        linkedin: "#",
      },
    },
  ];

  return (
    <section className="team-15 team  py-20" id="team">
      <div className="container mx-auto" data-aos="fade-up">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-gray-600">
            Necessitatibus eius consequatur ex aliquid fuga eum quidem sint
            consectetur velit.
          </p>
        </div>

        <div className="content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="mb-8">
                <div className="relative group">
                  <figure className="relative">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full rounded-lg transition-all duration-300 transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg">
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <a
                          href={member.socialLinks.facebook}
                          className="text-white hover:text-blue-500"
                        >
                          <i className="bi bi-facebook text-xl"></i>
                        </a>
                        <a
                          href={member.socialLinks.twitter}
                          className="text-white hover:text-blue-500"
                        >
                          <i className="bi bi-twitter-x text-xl"></i>
                        </a>
                        <a
                          href={member.socialLinks.linkedin}
                          className="text-white hover:text-blue-500"
                        >
                          <i className="bi bi-linkedin text-xl"></i>
                        </a>
                      </div>
                    </div>
                  </figure>
                  <div className="text-center mt-4">
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <span className="text-gray-600">{member.position}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
